import { Box, Button, Center, Flex, HStack, Image, SimpleGrid, Span, Stack, Text } from "@chakra-ui/react"
import { Corner } from "components"

const Intro = () => {
  return (
    <Box position="relative" py={20}>
      <Stack gap={6}>
        <Text color="terr.50" fontSize={60} fontWeight={700} textAlign="right">
          GIỚI THIỆU
        </Text>
        <SimpleGrid columnGap={20} columns={2}>
          <Box
            background="rgba(0, 6, 157, 0.06)"
            borderColor="rgba(0, 224, 234, 0.2)"
            borderRadius={16}
            borderWidth={1}
            p={6}
          >
            <Box h={360} overflowY="auto">
              <Text fontSize={18} whiteSpace="pre-line">
                {`Cuộc thi được tổ chức nhằm tìm kiếm các cá nhân, tổ chức có sản phẩm, dịch vụ, giải pháp có tính ứng dụng cao cho ngành công nghệ blockchain, góp phần xây dựng, thúc đẩy phát triển mạng blockhain layer 1 “Make in Việt Nam”.\n\nThông qua cuộc thi, Ban Tổ chức sẽ xây dựng cộng đồng chuyên gia blockchain, công nghệ, tài chính tại Việt Nam, thúc đẩy tiến trình phổ cập kiến thức, nâng cao nhận thức về tiềm năng và lợi ích của blockchain đối với xã hội và nền kinh tế. Qua đó, thúc đẩy ứng dụng công nghệ blockchain, đặc biệt là trong các lĩnh vực trọng điểm của chuyển đổi số quốc gia.\n\nCuộc thi dành cho tất cả các cá nhân là kỹ sư, nhà phát triển phần mềm, chuyên gia blockchain và những người đam mê công nghệ, sinh viên các trường đại học có khả năng lập trình, thiết kế và xây dựng giải pháp và ứng dụng công nghệ blockchain.`}
              </Text>
              <Text color="terr.50" fontSize={18} fontStyle="italic" mt={5} whiteSpace="pre-line">
                {`Lưu ý:\nSinh viên các trường cao đẳng, đại học được khuyến khích tham gia. Ban Tổ chức sẽ áp dụng tiêu chí chấm thi linh hoạt hơn, phù hợp với đặc thù và mức độ hoàn thiện sản phẩm so với các nhóm dự thi đã có kinh nghiệm làm việc hoặc phát triển dự án.\n\nCác cá nhân tham gia theo hình thức nhóm (các nhóm tự chủ động tìm kiếm và sắp xếp thành viên, Ban Tổ chức không sắp xếp nhóm).`}
              </Text>
            </Box>
          </Box>

          <Stack>
            <Image h={360} src="/images/people.png" />
            <Text color="terr.50" fontStyle="italic" textAlign="right">
              (*) Hàng trăm bạn trẻ đăng ký tham gia cuộc thi.
            </Text>
          </Stack>
        </SimpleGrid>
      </Stack>
      <Corner placement="bottom" />
    </Box>
  )
}

export default Intro
