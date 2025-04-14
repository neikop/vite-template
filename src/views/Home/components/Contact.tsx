import { Flex, HStack, IconButton, Image, Input, InputGroup, Separator, Stack, Text } from "@chakra-ui/react"
import { MdPhone } from "react-icons/md"
import { Link } from "react-router"

const Contact = () => {
  return (
    <Stack bg="white" borderTopRadius={32} color="rgba(58, 58, 58, 1)" mt={40} position="relative">
      <Flex justifyContent="space-between" px={20} py={10}>
        <Stack gap={6} maxW={400}>
          <Stack gap={3}>
            <Text fontSize={34} fontWeight={600}>
              Liên hệ với chúng tôi
            </Text>
            <Text>
              Hội đồng Giám khảo và Hội đồng Chuyên môn bao gồm các chuyên gia uy tín hàng đầu có kiến thức chuyên sâu
              và giàu kinh nghiệm
            </Text>
          </Stack>
          <InputGroup>
            <Input colorPalette="cyan" placeholder="Enter Your Email" size="lg" />
          </InputGroup>
          <HStack>
            {[
              { icon: "/icons/Facebook.svg", url: "https://google.com" },
              { icon: "/icons/Instagram.svg", url: "https://google.com" },
              { icon: "/icons/Google.svg", url: "https://google.com" },
              { icon: "/icons/X.svg", url: "https://google.com" },
              { icon: "/icons/LinkedIn.svg", url: "https://google.com" },
            ].map((item, index) => {
              return (
                <Link key={index} target="_blank" to={item.url}>
                  <IconButton variant="ghost">
                    <Image src={item.icon} />
                  </IconButton>
                </Link>
              )
            })}
          </HStack>
        </Stack>

        <Stack gap={4} w={360}>
          <Text fontSize={18} fontWeight={600}>
            Contact
          </Text>
          <Stack>
            <HStack>
              <MdPhone />
              <Text>+123 456 7890</Text>
            </HStack>
            <HStack>
              <MdPhone />
              <Text>+123 456 7890</Text>
            </HStack>
            <HStack>
              <MdPhone />
              <Text>+123 456 7890</Text>
            </HStack>
          </Stack>
        </Stack>
      </Flex>
      <Separator />
      <Flex justifyContent="space-between" px={20} py={10}>
        <Text>© 2025 Macat Megatrons. All rights reserved.</Text>
        <HStack gap={4}>
          {[
            { href: "/", text: "Privacy Policy" },
            { href: "/", text: "Term of Use" },
            { href: "/", text: "Legal" },
            { href: "/", text: "Site Map" },
          ].map((item, index) => {
            return (
              <Link key={index} to={item.href}>
                <Text _hover={{ textDecoration: "underline" }} fontSize={14} fontWeight={500}>
                  {item.text}
                </Text>
              </Link>
            )
          })}
        </HStack>
      </Flex>
    </Stack>
  )
}

export default Contact
