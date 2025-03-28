import { LoadingButton } from "@mui/lab"
import { Box, Container, Stack, TextField } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import logo from "assets/icons/logo.png"
import bannerLogin from "assets/images/banner-login.png"
import { Flex, FlexColumn, InputPassword, Text } from "components/common"
import { useResponsive } from "hooks"
import { enqueueSnackbar } from "notistack"
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link } from "react-router"
import { signIn, updatePermissions, updateUser } from "reducers/profileSlice"
import { authRoute } from "routes"
import { authService, queryClient, userService } from "services"

type LoginFormValues = {
  password: string
  username: string
}

const LoginScreen = () => {
  const { isDesktop } = useResponsive()

  const dispatch = useDispatch()
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<LoginFormValues>({
    defaultValues: {
      password: "",
      username: "",
    },
  })

  const loginMutation = useMutation({ mutationFn: authService.login })

  const onSubmit = async (values: LoginFormValues) => {
    const { username } = values
    const loginInfo = await loginMutation.mutateAsync({
      ...values,
      username: username.trim().toLowerCase(),
    })

    dispatch(signIn({ ...loginInfo, isLoggedIn: false }))

    await Promise.all([userService.getMe(), userService.getPermissions()]).then(([user, permission]) => {
      dispatch(updateUser(user))
      dispatch(updatePermissions(permission.permissions))
      dispatch(signIn(loginInfo))
    })

    enqueueSnackbar("Đăng nhập thành công")
    queryClient.invalidateQueries()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  return (
    <Container maxWidth="sm">
      <Box
        className="fixed left-0 right-0 top-0 h-[480px] lg:left-[5%] lg:right-[5%] lg:top-[2%] lg:rounded-3xl"
        sx={{ background: `url(${bannerLogin}) no-repeat center / cover` }}
      />
      <Stack className="relative z-10 gap-6 rounded-3xl bg-white p-6 lg:p-12">
        <Flex className="justify-center">
          <img className="h-[60px]" src={logo} />
        </Flex>
        <Stack>
          <Text className="text-center text-xl font-bold">Đăng ký tài khoản</Text>
          <Text className="text-center font-bold text-primary-main">Vui lòng nhập thông tin tài khoản</Text>
        </Stack>

        <FlexColumn className="items-center justify-center gap-6">
          <Controller
            control={control}
            name="username"
            render={({ field, fieldState: { error } }) => (
              <TextField
                autoComplete="username"
                fullWidth
                label="Tên đăng nhập"
                required
                {...field}
                error={!!error}
                helperText={error?.message}
                onKeyDown={handleKeyDown}
              />
            )}
            rules={{
              required: "Tên đăng nhập không được để trống",
            }}
          />

          <Controller
            control={control}
            name="password"
            render={({ field, fieldState: { error } }) => (
              <InputPassword
                autoComplete="current-password"
                fullWidth
                label="Mật khẩu"
                required
                {...field}
                error={!!error}
                helperText={error?.message}
                onKeyDown={handleKeyDown}
              />
            )}
            rules={{
              required: "Mật khẩu không được để trống",
            }}
          />

          <LoadingButton
            fullWidth
            loading={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            size="large"
            variant="contained"
          >
            Đăng nhập
          </LoadingButton>

          <Flex className="w-full justify-center gap-2">
            <Text>Đã có tài khoản?</Text>
            <Link to={authRoute.login.url}>
              <Text className="font-bold text-primary-main hover:brightness-90">Đăng nhập</Text>
            </Link>
          </Flex>
        </FlexColumn>
      </Stack>
    </Container>
  )
}

export default LoginScreen
