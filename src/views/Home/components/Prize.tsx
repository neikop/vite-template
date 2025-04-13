import {
  Box,
  Button,
  Center,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  Image,
  Portal,
  SimpleGrid,
  Span,
  Stack,
  Text,
} from "@chakra-ui/react"
import { Corner } from "components"
import { Fragment } from "react"

const Prize = () => {
  return (
    <Stack gap={12} position="relative" py={20}>
      <Stack alignItems="center" position="relative" zIndex={1}>
        <Text color="terr.50" fontSize={60} fontWeight={700}>
          GIẢI THƯỞNG
        </Text>
        <Text fontSize={34}>
          <Span color="terr.50" fontWeight={600}>
            3,5 TỶ ĐỒNG TIỀN MẶT
          </Span>{" "}
          VÀ CÁC PHẦN THƯỞNG GIÁ TRỊ KHÁC
        </Text>
      </Stack>

      <SimpleGrid columnGap={20} position="relative" rowGap={8} templateColumns="3fr 2fr" zIndex={1}>
        <Center className="bg-gradient" mx="auto" px={14} py={4} w="fit-content">
          <Text fontSize={26} fontWeight={600} textAlign="center">
            GIẢI THƯỞNG TIỀN MẶT
            <br />
            VỚI CÁC ĐỘI THI
          </Text>
        </Center>

        <Box />

        <Stack alignItems="center" borderColor="rgba(0, 224, 234, 0.35)" borderRadius={32} borderWidth={1} p={6}>
          <SimpleGrid columns={2}>
            {[
              { description: "1 TỶ ĐỒNG", title: `Giải Nhất chủ đề\nLayer 1 “Make in Vietnam”` },
              { description: "500 TRIỆU ĐỒNG", title: `Giải Nhất chủ đề Sàn Giao dịch\nTập trung và Phi tập trung` },
              { description: "500 TRIỆU ĐỒNG", title: `Giải Nhất chủ đề Truy vết` },
              { description: "500 TRIỆU ĐỒNG", title: `Giải Nhất chủ đề Cầu nối\nBlockchain (Bridge)` },
            ].map((item, index) => {
              return (
                <Fragment key={index}>
                  <Box borderColor="whiteAlpha.300" borderRightWidth={1} borderTopWidth={index > 0 ? 1 : 0} p={4}>
                    <Text fontSize={18} textAlign="right" whiteSpace="pre-line">
                      {item.title}
                    </Text>
                  </Box>
                  <Box borderColor="whiteAlpha.300" borderTopWidth={index > 0 ? 1 : 0} p={4}>
                    <Text color="terr.50" fontSize={26} fontWeight={700}>
                      {item.description}
                    </Text>
                  </Box>
                </Fragment>
              )
            })}
          </SimpleGrid>

          <Text maxW="75%" textAlign="center">
            Các giải phụ theo các tiêu chí khác nhau của từng chủ đề và mức độ hoàn thiện của giải pháp
          </Text>
        </Stack>

        <Stack gap={8}>
          <Stack bg="url('/images/transfer.png') center / cover no-repeat" borderRadius={32} gap={8} p={8}>
            <Text fontSize={26} fontWeight={600} textAlign="center">
              ĐỐI VỚI CÁC TRƯỜNG
              <br />
              CAO ĐẲNG ĐẠI HỌC
            </Text>
            <Stack as="ul" gap={4} listStyle="disc" pl={6}>
              {[
                {
                  message: `Được hỗ trợ chi phí truyền thông về cuộc thi hackathon đến toàn thể sinh viên của nhà trường.`,
                },
                {
                  message: `Được trao giải thưởng trị giá 200 triệu đồng tiền mặt khi cử các đội thi và đạt giải Nhất (ở bất kỳ chủ đề nào) để khuyến khích xây dựng quỹ công nghệ và khuyến học.`,
                },
                {
                  message: `Được hỗ trợ tổ chức các hội thảo, seminar về các chủ đề liên quan đến hackathon nhằm phổ cập kiến thức, thúc đẩy niềm đam mê công nghệ và định hướng cơ hội nghề nghiệp cho sinh viên trong trường.`,
                },
              ].map((item, index) => {
                return (
                  <Text as="li" key={index}>
                    {item.message}
                  </Text>
                )
              })}
            </Stack>
          </Stack>
          <Flex justifyContent="flex-end">
            <Dialog.Root placement="center" size="lg">
              <Dialog.Trigger asChild>
                <Button variant="subtle">Các quyền lợi khác</Button>
              </Dialog.Trigger>
              <Portal>
                <Dialog.Backdrop bg="blackAlpha.800" />
                <Dialog.Positioner>
                  <Dialog.Content bg="black" borderColor="whiteAlpha.500" borderRadius={16} borderWidth={1}>
                    <Dialog.Header fontSize={26} justifyContent="center">
                      Các quyền lợi khác
                    </Dialog.Header>
                    <Dialog.Body fontSize={18}>
                      <SimpleGrid gap={12} templateColumns="180px 1fr">
                        <Text fontWeight={600}>Đối với tất cả các nhóm tham gia cuộc thi hackathon</Text>
                        <Stack as="ol" listStyle="disc" pl={6}>
                          {[
                            {
                              message: `Được cung cấp tài liệu, khóa học online/offline về các chủ đề của cuộc thi;`,
                            },
                            {
                              message: `Được hỗ trợ tư vấn định kỳ (2 tuần/lần hoặc khi cần thiết) theo nhóm, theo chủ đề và tư vấn riêng nhằm làm rõ các yêu cầu của cuộc thi và hoàn thiện bài thi ở mức độ tốt nhất;`,
                            },
                            {
                              message: `Được cấp Chứng nhận tham gia cuộc thi với các thành tích cụ thể theo chất lượng bài thi.`,
                            },
                          ].map((item, index) => {
                            return (
                              <Text as="li" key={index}>
                                {item.message}
                              </Text>
                            )
                          })}
                        </Stack>

                        <Text fontWeight={600}>Đối với các nhóm xuất sắc</Text>
                        <Stack as="ol" listStyle="disc" pl={6}>
                          {[
                            {
                              message: `Được ưu tiên mời làm việc tại các tổ chức, công ty công nghệ, tài chính công nghệ phù hợp là đối tác của cuộc thi với mức lương và đãi ngộ hấp dẫn.`,
                            },
                            {
                              message: `Được ưu tiên mời tham dự các sự kiện, hội thảo, triển lãm, cuộc thi khác với vai trò phù hợp (thí sinh tham dự, cố vấn,..)`,
                            },
                          ].map((item, index) => {
                            return (
                              <Text as="li" key={index}>
                                {item.message}
                              </Text>
                            )
                          })}
                        </Stack>
                      </SimpleGrid>
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
      </SimpleGrid>

      <Box
        bg="url('/images/ellipse.png') center / contain no-repeat"
        h="140%"
        position="absolute"
        top="-20%"
        w="full"
      />
      <Corner placement="bottom" />
    </Stack>
  )
}

export default Prize
