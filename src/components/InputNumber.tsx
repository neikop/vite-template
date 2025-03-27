import { InputBaseComponentProps } from "@mui/material"
import { forwardRef } from "react"
import { NumericFormat, NumericFormatProps } from "react-number-format"

type InputProps = InputBaseComponentProps & NumericFormatProps

type Props = InputProps & {
  onChange: (value?: unknown) => void
}

const InputNumber = forwardRef(({ onChange, ...props }: Props, ref) => {
  return (
    <NumericFormat
      allowNegative={false}
      decimalScale={4}
      getInputRef={ref}
      onValueChange={({ floatValue }) => {
        onChange(floatValue)
      }}
      thousandSeparator=","
      {...props}
    />
  )
})

export default InputNumber
