import { Box, Button, Center, Flex, HStack, Image, Stack, Text } from "@chakra-ui/react"
import { JSX } from "react"
import { LuHotel, LuHouse } from "react-icons/lu"
import { MdOutlineRunCircle, MdOutlineViewAgenda, MdRunCircle, MdViewAgenda } from "react-icons/md"
import { Link, useLocation } from "react-router"
import { privateRoute } from "routes"

type MenuItemProps = {
  icon?: JSX.Element
  name?: string
  path: string
}

const MenuItem = ({ name, path }: MenuItemProps) => {
  const location = useLocation()

  const isHome = path === "/"
  const isContain = location.pathname.startsWith(path)
  const isSelected = isHome ? location.pathname === path : isContain

  return (
    <Link to={path}>
      <Center
        _hover={{ bg: isSelected ? "purple.50" : "gray.100" }}
        borderTopColor={isSelected ? "purple.500" : "transparent"}
        borderTopWidth={3}
        h="full"
        pb={3}
        pt={2}
        px={6}
      >
        <Text color={isSelected ? "teal.600" : "black"} fontWeight="bold">
          {name}
        </Text>
      </Center>
    </Link>
  )
}

const AppSidebar = () => {
  return (
    <Flex alignItems="stretch" h="full">
      <MenuItem {...privateRoute.home} />
      <MenuItem {...privateRoute.bridge} />
    </Flex>
  )
}

export default AppSidebar
