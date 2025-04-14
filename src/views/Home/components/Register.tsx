import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Field,
  Flex,
  GridItem,
  HStack,
  Image,
  Input,
  InputGroup,
  SimpleGrid,
  Span,
  Stack,
  Steps,
  Text,
} from "@chakra-ui/react"
import { Corner } from "components"
import { useState } from "react"
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { MdCheck, MdCheckCircle } from "react-icons/md"

type RegisterFormType = {
  members: Array<{
    email: string
    name: string
    phone: string
    role: string
    telegram: string
    work: string
  }>
  track: number
}

const Register = () => {
  const [step, setStep] = useState(0)
  const form = useForm<RegisterFormType>({
    defaultValues: {
      members: [
        {
          email: "",
          name: "",
          phone: "",
          role: "",
          telegram: "",
          work: "",
        },
      ],
    },
  })
  const { watch } = form

  const watchTrack = watch("track")

  const steps = [{ title: "Chọn Phần Thi" }, { title: "Điền Thông Tin Nhóm" }, { title: "Xác Nhận Thông Tin" }]

  return (
    <Stack alignItems="center" gap={12} position="relative" py={20}>
      <Text color="terr.50" fontSize={60} fontWeight={700}>
        ĐĂNG KÝ
      </Text>

      <FormProvider {...form}>
        <Stack
          bg="rgba(255, 255, 255, 0.06)"
          borderColor="whiteAlpha.300"
          borderRadius={32}
          borderWidth={1}
          gap={12}
          p={12}
          w={800}
        >
          <Steps.Root colorPalette="cyan" count={steps.length} onStepChange={(e) => setStep(e.step)} step={step}>
            <Steps.List>
              {steps.map((step, index) => (
                <Steps.Item index={index} key={index} title={step.title}>
                  <Steps.Indicator />
                  <Steps.Separator ml={0} />
                </Steps.Item>
              ))}
            </Steps.List>

            {steps.map((step, index) => (
              <Steps.Content index={index} key={index} minH={480}>
                <Stack alignItems="center" gap={8}>
                  <Text fontSize={34} fontWeight={600}>
                    {step.title}
                  </Text>
                  <Box w="full">
                    {index === 0 && <Step1 />}
                    {index === 1 && <Step2 />}
                    {index === 2 && <Step3 />}
                  </Box>
                </Stack>
              </Steps.Content>
            ))}
            <Steps.CompletedContent>All steps are complete!</Steps.CompletedContent>

            <Flex justifyContent="flex-end" mt={4}>
              <ButtonGroup variant="subtle">
                <Steps.PrevTrigger asChild>
                  <Button>Bước trước</Button>
                </Steps.PrevTrigger>
                <Steps.NextTrigger asChild>
                  <Button disabled={!watchTrack}>Bước tiếp</Button>
                </Steps.NextTrigger>
              </ButtonGroup>
            </Flex>
          </Steps.Root>
        </Stack>
      </FormProvider>

      <Corner placement="bottom" />
    </Stack>
  )
}

const Step1 = () => {
  const { setValue, watch } = useFormContext()
  const watchTrack = watch("track")

  return (
    <SimpleGrid bg="url('/images/bg_theme.png') center / contain no-repeat" columns={2}>
      {[
        { content: `Layer 1 và nền tảng cơ sở hạ tầng\ncho mạng blockchain Việt Nam`, title: "Track 1" },
        { content: `Sàn Giao dịch Tập trung (CEX) và\nSàn Giao dịch Phi tập trung (DEX)`, title: "Track 2" },
        { content: `Truy vết (Tracing)`, title: "Track 3" },
        { content: `Cầu nối Blockchain (Bridge)`, title: "Track 4" },
      ].map((item, index) => {
        const isSelected = watchTrack === index + 1
        const isCorner = index === 0 || index === 3
        return (
          <Center
            bg={isCorner ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.03)"}
            className={`hover-box ${isSelected ? "active" : ""}`}
            cursor="pointer"
            flexDirection="column"
            gap={4}
            h={180}
            key={index}
            onClick={() => {
              setValue("track", isSelected ? 0 : index + 1)
            }}
          >
            <Text fontSize={34} fontWeight={600} zIndex={1}>
              {item.title}
            </Text>
            <Text className="description" whiteSpace="pre-line" zIndex={1}>
              {item.content}
            </Text>

            <Image className={index % 2 ? "right" : "left"} h="full" src={`/images/move_${index + 1}.png`} />
            {isSelected && (
              <Box position="absolute" right={4} top={4}>
                <MdCheckCircle color="green" size={20} />
              </Box>
            )}
          </Center>
        )
      })}
    </SimpleGrid>
  )
}

const Step2 = () => {
  const { control } = useFormContext<RegisterFormType>()
  const { fields: members } = useFieldArray({ control, name: "members" })

  return (
    <Stack>
      {members.map((member, index) => {
        return (
          <SimpleGrid columnGap={4} columns={2} key={member.id} rowGap={6}>
            <Controller
              control={control}
              name={`members.${index}.name`}
              render={({ field }) => {
                return (
                  <Field.Root>
                    <Field.Label>Họ và tên</Field.Label>
                    <Input placeholder="Nhập họ và tên" size="lg" {...field} />
                  </Field.Root>
                )
              }}
            />

            <Controller
              control={control}
              name={`members.${index}.phone`}
              render={({ field }) => {
                return (
                  <Field.Root>
                    <Field.Label>Số điện thoại</Field.Label>
                    <Input placeholder="Nhập số điện thoại" size="lg" {...field} />
                  </Field.Root>
                )
              }}
            />

            <Controller
              control={control}
              name={`members.${index}.email`}
              render={({ field }) => {
                return (
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input placeholder="Nhập email" size="lg" {...field} />
                  </Field.Root>
                )
              }}
            />

            <Controller
              control={control}
              name={`members.${index}.telegram`}
              render={({ field }) => {
                return (
                  <Field.Root>
                    <Field.Label>Telegram</Field.Label>
                    <Input placeholder="Nhập username" size="lg" {...field} />
                  </Field.Root>
                )
              }}
            />

            <GridItem colSpan={2}>
              <Controller
                control={control}
                name={`members.${index}.work`}
                render={({ field }) => {
                  return (
                    <Field.Root>
                      <Field.Label>Công việc / trường học hiện tại</Field.Label>
                      <Input placeholder="Nhập công việc / trường học hiện tại" size="lg" {...field} />
                    </Field.Root>
                  )
                }}
              />
            </GridItem>

            <GridItem colSpan={2}>
              <Controller
                control={control}
                name={`members.${index}.role`}
                render={({ field }) => {
                  return (
                    <Field.Root>
                      <Field.Label>Vai trò</Field.Label>
                      <Input placeholder="Vai trò" size="lg" {...field} />
                    </Field.Root>
                  )
                }}
              />
            </GridItem>
          </SimpleGrid>
        )
      })}
    </Stack>
  )
}

const Step3 = () => {
  const { control } = useFormContext()
  return (
    <SimpleGrid columns={2}>
      <Field.Root required>
        <Field.Label>
          Họ và tên <Field.RequiredIndicator />
        </Field.Label>
        <Input placeholder="Nhập họ và tên" />
      </Field.Root>
    </SimpleGrid>
  )
}

export default Register
