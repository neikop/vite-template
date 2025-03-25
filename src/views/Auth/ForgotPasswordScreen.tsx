import { Box, Input, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import bgImage from "assets/images/bglogin.jpg"
import { Button } from "components/ui/button"
import { enqueueSnackbar } from "notistack"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { authService } from "services"

type ForgotPasswordFormValues = {
  username: string
}

const ForgotPasswordScreen = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ForgotPasswordFormValues>()

  const { isPending, mutate } = useMutation({
    mutationFn: authService.forgotPassword,
    onError: () => {
      enqueueSnackbar(t("error"), { variant: "error" })
    },
    onSuccess: () => {
      enqueueSnackbar(t("password_reset"), {
        variant: "success",
      })
    },
  })

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    mutate(values)
  }
  const { t } = useTranslation()

  return (
    <Box
      className="flex h-screen w-screen items-center justify-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Box className="w-full max-w-sm rounded-md bg-black bg-opacity-50 p-8">
        <Text className="mb-8 text-center text-3xl font-extrabold text-white">{t("auth.forgot_password")}</Text>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Box className="relative">
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Box className="flex h-12 items-center rounded-full bg-white bg-opacity-20 p-2">
                  <FaUser className="mx-2 text-primary-main" />
                  <Input
                    {...field}
                    className="h-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={t("account")}
                    type="username"
                  />
                </Box>
              )}
              rules={{
                required: t("placeholder.enter_account"),
              }}
            />
            {errors.username && <Text className="mt-1 text-sm text-red-500">{errors.username.message}</Text>}
          </Box>
          <Box className="flex items-center text-white">
            <Link className="hover:underline" to="/login">
              {t("back_to_login")}
            </Link>
          </Box>

          <Box className="flex justify-center">
            <Button
              className="w-full rounded-full bg-primary-main py-2 font-bold text-white"
              disabled={isPending}
              loading={isPending}
              type="submit"
            >
              {t("send_request")}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default ForgotPasswordScreen
