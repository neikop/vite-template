import { Home } from "@mui/icons-material"
import { Button, Container, Stack } from "@mui/material"
import { Text } from "components/common"
import { useHomePath } from "hooks"
import { Link, useParams } from "react-router-dom"

const ErrorPage = () => {
  const { code } = useParams()
  const homePath = useHomePath()

  return (
    <Container>
      <Stack alignItems="center" gap={2}>
        <Text className="text-7xl font-bold">{code}</Text>
        {code === "403" && (
          <Text className="text-center font-bold md:text-xl">Bạn không có quyền thực hiện thao tác này</Text>
        )}
        {code === "404" && <Text className="text-center font-bold md:text-xl">Không tìm thấy trang yêu cầu</Text>}
        <Link to={homePath}>
          <Button startIcon={<Home />}>Quay lại</Button>
        </Link>
      </Stack>
    </Container>
  )
}

export default ErrorPage
