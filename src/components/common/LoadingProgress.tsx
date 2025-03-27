import { Box, LinearProgress, LinearProgressProps } from "@mui/material"

type Props = Partial<LinearProgressProps> & {
  loading?: boolean
}

const LoadingProgress = ({ loading, ...props }: Props) => {
  return loading ? (
    <Box sx={{ left: 0, position: "absolute", right: 0 }}>
      <LinearProgress {...props} />
    </Box>
  ) : (
    <></>
  )
}

export default LoadingProgress
