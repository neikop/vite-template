import { Box } from "@chakra-ui/react"

type Props = {
  placement: "bottom" | "top"
}

const Corner = ({ placement }: Props) => {
  return (
    <>
      {placement === "top" && (
        <>
          <Box
            borderColor="second.50"
            borderLeftWidth={6}
            borderTopWidth={6}
            h="42px"
            left={-10}
            position="absolute"
            top={-4}
            w="54px"
            zIndex={12}
          />
          <Box
            borderColor="second.50"
            borderRightWidth={6}
            borderTopWidth={6}
            h="42px"
            position="absolute"
            right={-10}
            top={-4}
            w="54px"
            zIndex={12}
          />
        </>
      )}
      {placement === "bottom" && (
        <>
          <Box
            borderBottomWidth={6}
            borderColor="second.50"
            borderLeftWidth={6}
            bottom={-10}
            h="42px"
            left={-10}
            position="absolute"
            w="54px"
            zIndex={12}
          />
          <Box
            borderBottomWidth={6}
            borderColor="second.50"
            borderRightWidth={6}
            bottom={-10}
            h="42px"
            position="absolute"
            right={-10}
            w="54px"
            zIndex={12}
          />
        </>
      )}
    </>
  )
}

export default Corner
