import {
  Box,
  Button,
  Center,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  IconButton,
  Image,
  Portal,
  SimpleGrid,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react"
import { Corner } from "components"
import { useEffect, useState } from "react"
import { Link } from "react-router"

const Theme = () => {
  const [showMessenger, setShowMessenger] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setShowMessenger(scrollTop >= 800)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <Stack alignItems="center" position="relative" py={20}>
      <Stack gap={6}>
        <Text color="terr.50" fontSize={60} fontWeight={700} textAlign="center">
          CHỦ ĐỀ
        </Text>
        <Stack gap={6} maxW={960}>
          <SimpleGrid bg="url('/images/bg_theme.png') center / contain no-repeat" columns={2}>
            {[
              { content: `Layer 1 và nền tảng cơ sở hạ tầng\ncho mạng blockchain Việt Nam`, title: "Track 1" },
              { content: `Sàn Giao dịch Tập trung (CEX) và\nSàn Giao dịch Phi tập trung (DEX)`, title: "Track 2" },
              { content: `Truy vết (Tracing)`, title: "Track 3" },
              { content: `Cầu nối Blockchain (Bridge)`, title: "Track 4" },
            ].map((item, index) => {
              const isCorner = index === 0 || index === 3
              return (
                <Center
                  bg={isCorner ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)"}
                  className="hover-box"
                  flexDirection="column"
                  gap={4}
                  h={180}
                  key={index}
                >
                  <Text fontSize={34} fontWeight={600} zIndex={1}>
                    {item.title}
                  </Text>
                  <Text className="description" whiteSpace="pre-line" zIndex={1}>
                    {item.content}
                  </Text>

                  <Image className={index % 2 ? "right" : "left"} h="full" src={`/images/move_${index + 1}.png`} />
                </Center>
              )
            })}
          </SimpleGrid>

          <Text color="terr.50" fontStyle="italic" textAlign="center" whiteSpace="pre-line">
            {`Lưu ý:\nCác sản phẩm, giải pháp tham dự cuộc thi cần hướng tới xây dựng, thúc đẩy phát triển mạng blockchain Layer 1 “Make in Vietnam” và các hệ sinh thái phục vụ cho ngành tài chính ngân hàng, đảm bảo khả năng chứng thực dữ liệu và kết nối thông suốt giữa hệ thống onchain và offchain.`}
          </Text>

          <Flex justifyContent="center">
            <Dialog.Root placement="center">
              <Dialog.Trigger asChild>
                <Button variant="subtle" zIndex={1}>
                  Quy định chung
                </Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop bg="blackAlpha.800" />
                <Dialog.Positioner>
                  <Dialog.Content bg="black" borderColor="whiteAlpha.500" borderRadius={16} borderWidth={1}>
                    <Dialog.Header>
                      <Dialog.Title fontSize={26}>Quy định chung</Dialog.Title>
                    </Dialog.Header>
                    <Dialog.Body fontSize={18}>
                      <Stack as="ol" listStyle="decimal" pl={6}>
                        {[
                          {
                            message: `Các bài dự thi phải là sản phẩm gốc, không sao chép hoặc vi phạm quyền tác giả và các quyền sở hữu trí tuệ khác của cá nhân, tổ chức khác. Các đội dự thi có quyền tham khảo ý kiến của các chuyên gia, tài liệu kỹ thuật, bài báo và nguồn thông tin hợp pháp khác để phục vụ quá trình làm bài thi nhưng phải tuân thủ đầy đủ các quy định của pháp luật hiện hành về quyền sở hữu trí tuệ.`,
                          },
                          {
                            message: `Ban Tổ chức có quyền sử dụng các dự án tham gia cuộc thi cho mục đích quảng bá và nghiên cứu.`,
                          },
                          {
                            message: `Ban Tổ chức có quyền thay đổi Thể lệ cuộc thi khi cần thiết, và sẽ thông báo cho các đội đăng ký tham gia và công bố công khai.`,
                          },
                          {
                            message: `Quyết định của Ban Tổ chức là quyết định cuối cùng trong mọi tình huống và tranh chấp (nếu có).`,
                          },
                        ].map((item, index) => {
                          return (
                            <Text as="li" key={index}>
                              {item.message}
                            </Text>
                          )
                        })}
                      </Stack>
                    </Dialog.Body>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton _hover={{ bg: "whiteAlpha.300" }} color="white" />
                    </Dialog.CloseTrigger>
                  </Dialog.Content>
                </Dialog.Positioner>
              </Portal>
            </Dialog.Root>
          </Flex>
        </Stack>
      </Stack>
      <Corner placement="bottom" />

      <Link to="https://google.com">
        <IconButton
          bg="terr.50"
          bottom={40}
          boxSize={14}
          cursor="pointer"
          display={showMessenger ? "flex" : "none"}
          position="fixed"
          right={20}
          rounded="full"
          zIndex={20}
        >
          <Image boxSize={8} src="/icons/Messenger.png" />
        </IconButton>
      </Link>
    </Stack>
  )
}

export default Theme
