import { Box, Button, Center, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { JSX } from "react"
import { LuHotel, LuHouse } from "react-icons/lu"
import { MdOutlineRunCircle, MdOutlineViewAgenda, MdRunCircle, MdViewAgenda } from "react-icons/md"
import { Link, useLocation } from "react-router"
import { privateRoute } from "routes"

type MenuItemProps = {
  icon?: JSX.Element
  // items?: SubMenuType[]
  name?: string
  path: string
}

const MenuItem = ({ icon, name, path }: MenuItemProps) => {
  const location = useLocation()

  const isHome = path === "/"
  const isContain = location.pathname.startsWith(path)
  const isSelected = isHome ? location.pathname === path : isContain

  return (
    <Box>
      <Link to={path}>
        <HStack
          minH={12}
          px={4}
          py={2}
          rounded={8}
          {...(isSelected && { bg: "primary.50" })}
          _hover={{ bg: "primary.100" }}
        >
          <Center>{icon}</Center>
          <Text>{name}</Text>
        </HStack>
      </Link>
    </Box>
  )
}

const AppSidebar = () => {
  return (
    <Stack borderWidth={1} gridArea="sidebar" m={2} py={2} rounded={16} shadow="inner">
      <Center gridArea="logo" p={2}>
        <Link to={privateRoute.home.path}>
          <Image src="/assets/react.svg" />
        </Link>
      </Center>
      <Stack overflow="auto" px={4}>
        <MenuItem {...privateRoute.home} icon={<MdOutlineViewAgenda size={20} />} />
        <MenuItem {...privateRoute.hotel} icon={<MdOutlineRunCircle size={20} />} />
      </Stack>
    </Stack>
  )
}

export default AppSidebar
