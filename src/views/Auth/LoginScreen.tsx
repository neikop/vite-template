import { Box, Button, For, HStack, Input, Text } from "@chakra-ui/react"
import { useMutation } from "@tanstack/react-query"
import { toaster } from "components/ui/toaster"
import { Controller, useForm } from "react-hook-form"
import { FaLock, FaUser } from "react-icons/fa"
import { Link } from "react-router"
import { authRoute } from "routes"
import { authService } from "services"
import { useProfileStore } from "store/profileStore"

type LoginFormValues = {
  password: string
  username: string
}

const LoginScreen = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginBody>()

  const { signIn } = useProfileStore()

  const { isPending, mutate } = useMutation({
    mutationFn: authService.login,
    onError: () => {},
    onSuccess: (data) => {
      signIn(data)
      toaster.create({ title: "Login success" })
    },
  })

  const onSubmit = async (values: LoginFormValues) => {
    mutate(values)
  }

  return (
    <Box className="flex h-screen w-screen items-center justify-center bg-cover bg-no-repeat">
      <Box className="bg-opacity-50 w-full max-w-sm rounded-md p-8">
        <Text className="mb-8 text-center text-3xl font-extrabold text-white">{"auth.login"}</Text>
        <HStack>
          <For each={["success", "error", "warning", "info", "loading"]}>
            {(type) => (
              <Button
                key={type}
                onClick={() =>
                  toaster.create({
                    title: `Toast status is ${type}`,
                    type: type,
                  })
                }
                size="sm"
                variant="outline"
              >
                {type}
              </Button>
            )}
          </For>
        </HStack>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <Box className="relative">
            <Controller
              control={control}
              name="username"
              render={({ field }) => (
                <Box className="bg-opacity-20 flex h-12 items-center rounded-full bg-white p-2">
                  <FaUser className="text-primary-main mr-2" />
                  <Input
                    {...field}
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={"placeholder.enter_account"}
                  />
                </Box>
              )}
              rules={{ required: "placeholder.enter_account" }}
            />
            {errors.username && <Text className="mt-1 text-sm text-red-500">{errors.username.message}</Text>}
          </Box>

          <Box className="relative">
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Box className="bg-opacity-20 flex h-12 items-center rounded-full bg-white p-2">
                  <FaLock className="text-primary-main mr-3" />
                  <Input
                    {...field}
                    className="w-full flex-1 bg-transparent text-white placeholder-gray-200 focus:outline-none"
                    placeholder={"placeholder.enter_password"}
                    type="password"
                  />
                </Box>
              )}
              rules={{ required: "placeholder.enter_password" }}
            />
            {errors.password && <Text className="mt-1 text-sm text-red-500">{errors.password.message}</Text>}
          </Box>

          <Box className="flex justify-between text-white">
            <Link className="hover:underline" to={authRoute.forgotPassword.url}>
              {"auth.forgot_password"}
            </Link>
            <Link className="hover:underline" to={authRoute.register.url}>
              {"auth.register"}
            </Link>
          </Box>

          <Box className="flex justify-center">
            <Button
              className="bg-primary-main w-full rounded-full py-2 font-bold text-white"
              disabled={isPending}
              loading={isPending}
              type="submit"
            >
              {"auth.login"}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default LoginScreen
