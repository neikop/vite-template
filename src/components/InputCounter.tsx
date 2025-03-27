import { Add, Remove } from "@mui/icons-material"
import { Button, InputBase } from "@mui/material"
import { Center } from "components/common"
import { forwardRef, useEffect, useState } from "react"
import { NumericFormat } from "react-number-format"

type Props = {
  onChange?: (value: number) => void
  value?: number
}

const InputCounter = forwardRef(({ onChange, value: nextValue }: Props, ref) => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    setValue(nextValue ?? 0)
  }, [nextValue])

  const handleChange = (value: number) => {
    setValue(value)
    onChange?.(value)
  }

  return (
    <Center className="h-[56px] max-w-fit gap-2 rounded border px-3 py-1">
      <Button
        onClick={() => {
          handleChange(Math.max(0, value - 1))
        }}
      >
        <Remove />
      </Button>
      <NumericFormat
        allowNegative={false}
        customInput={InputBase}
        getInputRef={ref}
        inputProps={{
          className: "text-center w-[40px] font-bold text-lg",
          maxLength: 3,
        }}
        onValueChange={({ floatValue }) => {
          handleChange(floatValue ?? 0)
        }}
        value={nextValue ?? value}
      />
      <Button
        onClick={() => {
          handleChange(value + 1)
        }}
      >
        <Add />
      </Button>
    </Center>
  )
})

export default InputCounter
