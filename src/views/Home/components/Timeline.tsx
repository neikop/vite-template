import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  SimpleGrid,
  Span,
  Stack,
  Text,
  Timeline as Time,
} from "@chakra-ui/react"
import { Corner } from "components"
import { MdStar } from "react-icons/md"

const Timeline = () => {
  return (
    <Stack position="relative" pt={20}>
      <SimpleGrid columnGap={20} templateColumns="360px 1fr">
        <Text color="terr.50" fontSize={60} fontWeight={700} textAlign="center">
          THỜI GIAN
        </Text>
        <Time.Root>
          {[
            { content: "Công bố cuộc thi.", highlight: true, time: "20/04" },
            { content: "Đóng cổng tiếp nhận bài thi vòng loại.", duration: "45 Ngày", highlight: true, time: "05/06" },
            {
              content: "BTC tiếp nhận các bài thi đủ tiêu chuẩn theo yêu cầu, chấm, chọn các dự án được vào vòng 2.",
              duration: "15 ngày",
              time: "05/06 - 20/06",
            },
            { content: "Công bố các dự án được vào vòng 2.", highlight: true, time: "20/06" },
            {
              content:
                "Các dự án được tuyển chọn vào vòng 2 được tư vấn trực tiếp với các mentor để hoàn thiện dự án (nếu cần). Các dự án sau khi hoàn thành sẽ pitching (online hoặc offline) trước Hội đồng chuyên môn để hoàn thiện lần cuối.",
              duration: "15 Ngày",
              time: "20/06 - 05/07",
            },
            { content: "Các đội gửi lại bài dự thi vòng 2 (đã hoàn thiện)", time: "05/07" },
            {
              content: "Hội đồng chuyên môn đánh giá và lựa chọn các dự án được vào vòng chung kết.",
              duration: "15 Ngày",
              time: "05/07 - 20/07",
            },
            {
              content: "Công bố các dự án xuất sắc được tuyển chọn vào vòng chung kết.",
              duration: "10 Ngày",
              highlight: true,
              time: "20/07 - 30/07",
            },
            {
              content: "Chung kết toàn quốc.",
              highlight: true,
              time: "Tháng 08/2025",
            },
          ].map((item, index) => {
            return (
              <Time.Item key={index}>
                <Time.Content gap={4} minH={28} mr={1.5} width={360}>
                  <Time.Title fontSize={32} fontWeight={400} justifyContent="flex-end">
                    {item.time}
                  </Time.Title>
                  {item.duration && (
                    <Time.Description color="whiteAlpha.800" fontSize={20} textAlign="right">
                      {item.duration}
                    </Time.Description>
                  )}
                </Time.Content>
                <Time.Connector>
                  <Time.Separator borderWidth={1} />
                  <Time.Indicator boxSize={8} ml={-1.5} mt={-1.5} outline="none">
                    <MdStar size={25} />
                  </Time.Indicator>
                </Time.Connector>
                <Time.Content>
                  <Time.Title fontSize={20} {...(item.highlight && { color: "terr.50" })}>
                    {item.content}
                  </Time.Title>
                </Time.Content>
              </Time.Item>
            )
          })}
        </Time.Root>
      </SimpleGrid>

      <Corner placement="bottom" />
    </Stack>
  )
}

export default Timeline
