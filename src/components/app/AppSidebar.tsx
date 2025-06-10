import { Center, Flex, Text } from "@chakra-ui/react"
import { JSX, ReactNode } from "react"
import { RxOpenInNewWindow } from "react-icons/rx"
import { Link, LinkProps, useLocation } from "react-router"
import { privateRoute } from "routes"

type MenuItemProps = {
  icon?: JSX.Element
  linkProps?: Partial<LinkProps>
  name?: ReactNode
  path: string
}

const MenuItem = ({ linkProps, name, path }: MenuItemProps) => {
  const location = useLocation()

  const isHome = path === "/"
  const isContain = location.pathname.startsWith(path)
  const isSelected = isHome ? location.pathname === path : isContain

  return (
    <Link to={path} {...linkProps}>
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
      <MenuItem {...privateRoute.transfer} />
      <MenuItem {...privateRoute.bridge} />
      <MenuItem
        linkProps={{ target: "_blank" }}
        name={
          <Flex gap={1}>
            Swap <RxOpenInNewWindow />
          </Flex>
        }
        path="https://one-matrix-uni-v2-interface.pages.dev"
      />
    </Flex>
  )
}

export default AppSidebar
