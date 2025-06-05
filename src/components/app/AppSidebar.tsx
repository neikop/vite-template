import { Center, Flex, Text } from "@chakra-ui/react"
import { JSX } from "react"
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
        _hover={{ backgroundColor: isSelected ? "bg.primary" : "bg.muted" }}
        borderTopColor={isSelected ? "primary.main" : "transparent"}
        borderTopWidth={3}
        h="full"
        pb={3}
        pt={2}
        px={6}
      >
        <Text color={isSelected ? "primary.dark" : "black"} fontWeight="bold">
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
