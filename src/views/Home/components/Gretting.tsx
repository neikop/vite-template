import { Box, Button, Center, Flex, HStack, IconButton, Image, SimpleGrid, Span, Stack, Text } from "@chakra-ui/react"
import { useState } from "react"

const Gretting = () => {
  return (
    <Stack alignItems="center" position="relative">
      <Center boxSize="686px" zIndex={1}>
        <div className="video-wrapper">
          <video autoPlay loop muted playsInline>
            <source src="/videos/layers.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </Center>

      <Stack alignItems="center" gap="60px" position="absolute" top="50%" transform="translateY(-50%)" zIndex={2}>
        <Stack alignItems="center" gap="32px">
          <Text fontSize={26}>
            Tìm kiếm tài năng{" "}
            <Span className="diamond-text" fontWeight={600}>
              Blockchain Việt Nam
            </Span>
          </Text>

          <Text className="heading" fontSize={110} fontWeight={600}>
            VietChain TALENTS
          </Text>
          <Text fontSize={24}>
            Hơn{" "}
            <Span color="terr.50" fontSize={26} fontWeight={600}>
              3,5 TỶ ĐỒNG TIỀN MẶT
            </Span>{" "}
            và nhiều giải thưởng giá trị khác
          </Text>

          <HStack gap={6}>
            <Button variant="subtle">Đăng ký</Button>
            <Button bg="whiteAlpha.400">Tài liệu cuộc thi</Button>
          </HStack>
        </Stack>

        <Stack alignItems="center" gap="26px">
          <Text color="whiteAlpha.800" fontSize={18}>
            Đối tác và nhà tài trợ
          </Text>
          <HStack gap={6}>
            <Image h="48px" src="icons/Logo_HV_KTQS.png" />
            <Image h="42px" src="icons/Logo_RMIT.png" />
            <Image h="39px" src="icons/Logo_DH_Luat.png" />
            <Image h="39px" src="icons/Logo_DHQG_TPHCM.png" />
            <Image h="48px" src="icons/Logo_DH_Y_Duoc.png" />
            <Image h="39px" src="icons/Logo_AlphaTrue.png" />
            <Image h="48px" src="icons/Logo_UEH.png" />
          </HStack>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default Gretting
