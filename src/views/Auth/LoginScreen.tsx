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
import { signIn, updatePermissions, updateUser } from "reducers/profileSlice"
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
        className="fixed top-0 right-0 left-0 h-[480px] lg:top-[2%] lg:right-[5%] lg:left-[5%] lg:rounded-3xl"
        sx={{ background: `url(${bannerLogin}) no-repeat center / cover` }}
      />
      <Stack className="relative z-10 gap-6 rounded-3xl bg-white p-6 lg:p-12">
        <Flex justifyContent="center">
          <img className="h-[120px]" src={logo} />
        </Flex>
        <Stack>
          <Text className="text-center text-xl font-bold">{isDesktop && "Chào mừng đến với "}Servicing Portal</Text>
          <Text className="text-primary-main text-center font-bold">Vui lòng đăng nhập vào tài khoản của bạn</Text>
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
        </FlexColumn>
      </Stack>
    </Container>
  )
}

export default LoginScreen
