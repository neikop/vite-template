import { LoadingButton } from "@mui/lab"
import { Box, Container, Stack, TextField } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import logo from "assets/icons/logo.png"
import bannerLogin from "assets/images/banner-login.png"
import { Flex, FlexColumn, InputPassword, Text } from "components/common"
import { useResponsive } from "hooks"
import { enqueueSnackbar } from "notistack"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { Link, useLocation, useParams, useSearchParams } from "react-router"
import { signIn, updatePermissions, updateUser } from "reducers/profileSlice"
import { authRoute } from "routes"
import { authService, queryClient, userService } from "services"

type EmailVerifyValues = {
  password: string
  username: string
}

type EmailParams = {
  email?: string
  token?: string
}

const EmailVerifyScreen = () => {
  const { isDesktop } = useResponsive()
  const [searchParams] = useSearchParams()

  const params: EmailParams = Object.fromEntries(searchParams.entries())

  const dispatch = useDispatch()
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<EmailVerifyValues>({
    defaultValues: {
      password: "",
      username: "",
    },
  })

  const verifyEmailMutation = useMutation({ mutationFn: authService.verifyEmail })
  const loginMutation = useMutation({ mutationFn: authService.login })

  useEffect(() => {
    if (params.email && params.token) {
      verifyEmailMutation.mutateAsync(params as EmailVerifyBody)
    }
  }, [])

  const onSubmit = async (values: EmailVerifyValues) => {
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
    <Container className="py-4" maxWidth="sm">
      <Box
        className="fixed left-0 right-0 top-0 h-[480px] lg:left-[5%] lg:right-[5%] lg:top-[2%] lg:rounded-3xl"
        sx={{ background: `url(${bannerLogin}) no-repeat center / cover` }}
      />
      <Stack className="relative z-10 gap-6 rounded-3xl bg-white p-6 lg:p-12">
        <Flex className="justify-center">
          <img className="h-[60px]" src={logo} />
        </Flex>
        <Stack>
          <Text className="text-center text-xl font-bold">{isDesktop && "Chào mừng đến với "}Servicing Portal</Text>
          <Text className="text-center font-bold text-primary-main">Vui lòng đăng nhập vào tài khoản của bạn</Text>
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

          <Flex className="w-full justify-end">
            <Link to={authRoute.forgotPassword.url}>
              <Text className="font-bold text-primary-main hover:brightness-90">Quên mật khẩu</Text>
            </Link>
          </Flex>

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
            {isDesktop && <Text>Chưa có tài khoản?</Text>}
            <Link to={authRoute.register.url}>
              <Text className="font-bold text-primary-main hover:brightness-90">Đăng ký ngay</Text>
            </Link>
          </Flex>
        </FlexColumn>
      </Stack>
    </Container>
  )
}

export default EmailVerifyScreen
