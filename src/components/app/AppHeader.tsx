import { Box, Button, Flex, HStack, Image, Text } from "@chakra-ui/react"
import { Corner } from "components"
import { Link } from "react-router"

const AppHeader = () => {
  return (
    <HStack h={24} position="sticky" top={10} zIndex={10}>
      <Corner placement="top" />
      <Flex bgColor="blackAlpha.800" justifyContent="space-between" position="relative" w="full">
        <HStack gap={6} h={20}>
          <Image h="60px" src="/icons/BanCoYeuChinhPhu.png" />
          <Image h="48px" src="/icons/OneMatrix.png" />
          <Image h="48px" src="/icons/HiepHoiBlockchain.png" />
        </HStack>

        <HStack gap={4}>
          {[
            { href: "/", label: "Trang chủ" },
            { href: "/", label: "Giới thiệu" },
            { href: "/", label: "Chủ đề" },
            { href: "/", label: "Giải thưởng" },
            { href: "/", label: "Giám khảo" },
            { href: "/", label: "Thời trang" },
            { href: "/", label: "Đăng ký" },
            { href: "/", label: "Liên hệ" },
          ].map((item, index) => {
            return (
              <Link key={index} to={item.href}>
                <Text _hover={{ color: "terr.50" }} color="white" fontWeight={500}>
                  {item.label}
                </Text>
              </Link>
            )
          })}
        </HStack>
      </Flex>
    </HStack>
  )
}

export default AppHeader
