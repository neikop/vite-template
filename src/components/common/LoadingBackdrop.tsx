import { Backdrop, BackdropProps, CircularProgress } from "@mui/material"

type Props = Partial<BackdropProps> & {
  loading?: boolean
}

const LoadingBackdrop = ({ loading, ...props }: Props) => {
  return (
    <Backdrop
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        position: "absolute",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      {...props}
      open={props.open ?? loading === true}
    >
      <CircularProgress />
    </Backdrop>
  )
}

export default LoadingBackdrop
