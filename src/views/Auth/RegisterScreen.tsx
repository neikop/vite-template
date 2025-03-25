import { Box, Input, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import bgImage from "assets/images/bglogin.jpg"
import { Button } from "components/ui/button"
import { PasswordInput } from "components/ui/password-input"
import { enqueueSnackbar } from "notistack"
import { Controller, useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { FaBuilding, FaLock, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa"
import { IoMdMail } from "react-icons/io"
import { MdDriveFileRenameOutline } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"
import { authRoute } from "routes"
import { authService, queryClient } from "services"
import { useProfileStore } from "store/profileStore"

type RegisterFormValues = {
  address: string
  email: string
  name: string
  password: string
  phone: number
  shortName: string
  username: string
}

const RegisterScreen = () => {
  const navigate = useNavigate()
  const { setUser } = useProfileStore()

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormValues>({})

  const { isPending, mutate } = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data)
      enqueueSnackbar(t("register_success"), { variant: "success" })
      queryClient.invalidateQueries({ queryKey: ["userService.getMe"] })
      navigate(authRoute.login.url)
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    mutate(values)
  }
  const { t } = useTranslation()

  return (
    <Box
      className="flex h-screen w-screen items-center justify-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Box className="w-full max-w-sm rounded-md bg-black bg-opacity-50 p-8">
        <Text className="mb-8 text-center text-3xl font-extrabold text-white">{t("auth.register")}</Text>

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
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={t("placeholder.enter_account")}
                  />
                </Box>
              )}
              rules={{ required: t("placeholder.enter_account") }}
            />
            {errors.username && <Text className="mt-1 text-sm text-red-500">{errors.username.message}</Text>}
          </Box>

          <Box className="relative">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Box className="flex h-12 items-center rounded-full bg-white bg-opacity-20 p-2">
                  <FaLock className="mx-2 text-primary-main" />
                  <PasswordInput
                    {...field}
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={t("placeholder.enter_password")}
                    type="password"
                  />
                </Box>
              )}
              rules={{
                minLength: {
                  message: t("placeholder.password_8"),
                  value: 8,
                },
                pattern: {
                  message: t("placeholder.password_upper_special"),
                  value: /^(?=.*[A-Z])(?=.*[!@#$&*]).*$/,
                },
                required: t("placeholder.enter_password"),
              }}
            />
            {errors.password && <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>}
          </Box>

          <Box className="relative">
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Box className="flex h-12 items-center rounded-full bg-white bg-opacity-20 p-2">
                  <IoMdMail className="mx-2 text-primary-main" />
                  <Input
                    {...field}
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={t("placeholder.enter_email")}
                    type="email"
                  />
                </Box>
              )}
              rules={{
                pattern: {
                  message: t("placeholder.invalid_email"),
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                },
                required: t("placeholder.enter_email"),
              }}
            />
            {errors.email && <Text className="mt-1 text-sm text-red-500">{errors.email.message}</Text>}
          </Box>

          <Box className="relative">
            <Controller
              control={control}
              name="phone"
              render={({ field }) => (
                <Box className="flex h-12 items-center rounded-full bg-white bg-opacity-20 p-2">
                  <FaPhone className="mx-2 text-primary-main" />
                  <Input
                    {...field}
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={t("placeholder.enter_phone_number")}
                  />
                </Box>
              )}
              rules={{
                pattern: {
                  message: t("placeholder.invalid_phone_number"),
                  value: /^0\d{9,10}$/,
                },
                required: t("placeholder.enter_phone_number"),
              }}
            />
            {errors.phone && <Text className="mt-1 text-sm text-red-500">{errors.phone.message}</Text>}
          </Box>

          <Box className="relative">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Box className="flex h-12 items-center rounded-full bg-white bg-opacity-20 p-2">
                  <FaBuilding className="mx-2 text-primary-main" />
                  <Input
                    {...field}
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={t("placeholder.enter_company_name")}
                  />
                </Box>
              )}
              rules={{
                maxLength: {
                  message: t("company_name_max_200_char"),
                  value: 200,
                },
                required: t("placeholder.enter_company_name"),
              }}
            />
            {errors.name && <Text className="mt-1 text-sm text-red-500">{errors.name.message}</Text>}
          </Box>

          <Box className="relative">
            <Controller
              control={control}
              name="address"
              render={({ field }) => (
                <Box className="flex h-12 items-center rounded-full bg-white bg-opacity-20 p-2">
                  <FaMapMarkerAlt className="mx-2 text-primary-main" />
                  <Input
                    {...field}
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={t("placeholder.enter_address")}
                  />
                </Box>
              )}
              rules={{ required: t("placeholder.enter_address") }}
            />
            {errors.address && <Text className="mt-1 text-sm text-red-500">{errors.address.message}</Text>}
          </Box>

          <Box className="relative">
            <Controller
              control={control}
              name="shortName"
              render={({ field }) => (
                <Box className="flex h-12 items-center rounded-full bg-white bg-opacity-20 p-2">
                  <MdDriveFileRenameOutline className="mx-2 text-primary-main" />
                  <Input
                    {...field}
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={t("placeholder.enter_short_name")}
                  />
                </Box>
              )}
              rules={{
                maxLength: {
                  message: t("short_name_max_20_char"),
                  value: 20,
                },
                required: t("placeholder.enter_short_name"),
              }}
            />
            {errors.shortName && <Text className="mt-1 text-sm text-red-500">{errors.shortName.message}</Text>}
          </Box>
          <Box className="flex items-center text-white">
            <Link className="hover:underline" to="/login">
              {t("back_to_login")}
            </Link>
          </Box>

          <Box className="text-center">
            <Button
              className="w-full rounded-full bg-primary-main py-2 font-bold text-white"
              disabled={isPending}
              loading={isPending}
              type="submit"
              variant="outline"
            >
              {t("auth.register")}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default RegisterScreen
