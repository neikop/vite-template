import { LoadingButton } from "@mui/lab"
import { Button, Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Stack } from "@mui/material"
import { useMutation } from "@tanstack/react-query"
import { DialogCloseButton, InputPassword } from "components/common"
import { enqueueSnackbar } from "notistack"
import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { userService } from "services"

type DialogController = DialogProps & PopupController

type Props = DialogController

const ProfileChangePasswordDialog = ({ onClose, onSuccess, ...props }: Props) => {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
    reset,
  } = useForm<ChangePasswordBody>({
    defaultValues: {
      confirmNewPassword: "",
      newPassword: "",
      oldPassword: "",
    },
  })

  const changePasswordMutation = useMutation({ mutationFn: userService.changeUserPassword })

  const onSubmit = async (values: ChangePasswordBody) => {
    if (values.newPassword !== values.confirmNewPassword) {
      enqueueSnackbar("Mật khẩu mới và xác nhận không khớp", { variant: "error" })
      return
    }

    const { confirmNewPassword, ...payload } = values
    await changePasswordMutation.mutateAsync(payload)
    enqueueSnackbar("Thay đổi mật khẩu thành công", { variant: "success" })
    onClose()
    onSuccess?.()
  }

  useEffect(() => {
    if (props.open) {
      reset({
        confirmNewPassword: "",
        newPassword: "",
        oldPassword: "",
      })
    }
  }, [reset, props.open])

  return (
    <Dialog maxWidth="xs" {...props}>
      <DialogCloseButton onClick={onClose} />
      <DialogTitle>Đổi mật khẩu</DialogTitle>
      <DialogContent>
        <Stack gap={3}>
          <Controller
            control={control}
            name="oldPassword"
            render={({ field, fieldState: { error } }) => (
              <InputPassword
                fullWidth
                label="Mật khẩu cũ"
                required
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
            rules={{
              required: "Mật khẩu cũ không được để trống",
            }}
          />
          <Controller
            control={control}
            name="newPassword"
            render={({ field, fieldState: { error } }) => (
              <InputPassword
                fullWidth
                label="Mật khẩu mới"
                required
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
            rules={{
              required: "Mật khẩu mới không được để trống",
            }}
          />
          <Controller
            control={control}
            name="confirmNewPassword"
            render={({ field, fieldState: { error } }) => (
              <InputPassword
                fullWidth
                label="Xác nhận mật khẩu mới"
                required
                {...field}
                error={!!error}
                helperText={error?.message}
              />
            )}
            rules={{
              required: "Xác nhận mật khẩu mới không được để trống",
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
        <LoadingButton loading={isSubmitting} onClick={handleSubmit(onSubmit)} variant="contained">
          Thay đổi mật khẩu
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default ProfileChangePasswordDialog
