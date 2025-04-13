import { Box, Button, Center, Flex, HStack, Image, SimpleGrid, Span, Stack, Text } from "@chakra-ui/react"
import { Corner } from "components"

const People = () => {
  return (
    <Stack gap={12} position="relative" py={20}>
      <Flex gap={20}>
        <Stack gap={4} w={400}>
          <Text color="terr.50" fontSize={60} fontWeight={700}>
            GIÁM KHẢO
          </Text>
          <Text fontSize={26} fontWeight={600}>
            HỘI ĐỒNG GIÁM KHẢO VÀ HỘI ĐỒNG CHUYÊN MÔN
          </Text>
        </Stack>

        <Text flex={1} fontSize={18} whiteSpace="pre-line">
          {`Hội đồng Giám khảo và Hội đồng Chuyên môn bao gồm các chuyên gia uy tín hàng đầu có kiến thức chuyên sâu và giàu kinh nghiệm thực tế trong các lĩnh vực blockchain, chuyển đổi số, tài chính số, pháp lý từ các cơ quan quản lý nhà nước, doanh nghiệp…\n\n“Danh sách Hội đồng Giám khảo và Hội đồng Chuyên môn sẽ được liên tục cập nhật”.`}
        </Text>
      </Flex>

      <Flex flexWrap="wrap" gap={8} justifyContent="center">
        {[
          { image: "/images/person.png", name: "John Henry", title: "CEO & FOUNDER" },
          { image: "/images/person.png", name: "John Henry", title: "CEO & FOUNDER" },
          { image: "/images/person.png", name: "John Henry", title: "CEO & FOUNDER" },
          { image: "/images/person.png", name: "John Henry", title: "CEO & FOUNDER" },
          { image: "/images/person.png", name: "John Henry", title: "CEO & FOUNDER" },
        ].map((item, index) => {
          return (
            <Box
              bg={`url('${item.image}') center / cover no-repeat`}
              borderRadius={12}
              h={340}
              key={index}
              position="relative"
              w={266}
            >
              <Stack
                alignItems="center"
                bg="linear-gradient(to bottom, rgba(11, 11, 33, 0), rgba(11, 11, 33, 0.8))"
                bottom={0}
                h={120}
                justifyContent="flex-end"
                p={4}
                position="absolute"
                w="full"
              >
                <Text fontSize={18} fontWeight={600}>
                  {item.name}
                </Text>
                <Text color="whiteAlpha.800" fontSize={14}>
                  {item.title}
                </Text>
              </Stack>
            </Box>
          )
        })}
      </Flex>

      <Corner placement="bottom" />
    </Stack>
  )
}

export default People
