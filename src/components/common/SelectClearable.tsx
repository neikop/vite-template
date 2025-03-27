import { Clear } from "@mui/icons-material"
import { IconButton, TextField, TextFieldProps } from "@mui/material"
import { forwardRef, Ref } from "react"

type Props = TextFieldProps & {
  clearable?: boolean
  onClear?: () => void
}

const SelectClearable = forwardRef(({ clearable = true, onClear, ...props }: Props, ref: Ref<HTMLDivElement>) => {
  return (
    <TextField
      {...props}
      InputProps={{
        ...props.InputProps,
        endAdornment: clearable && (
          <IconButton
            className="SelectClearable-clearIndicator"
            onClick={onClear}
            sx={{ display: "none", padding: 0.5, right: 16 }}
          >
            <Clear fontSize="small" />
          </IconButton>
        ),
      }}
      ref={ref}
      sx={{
        ...props.sx,
        "&:hover .MuiInputBase-inputAdornedEnd": {
          marginRight: clearable && props.value ? "-40px" : "unset",
        },
        "&:hover .SelectClearable-clearIndicator": {
          display: props.value ? "inline-flex" : "none",
        },
      }}
    />
  )
})

export default SelectClearable
