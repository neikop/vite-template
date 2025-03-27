import { ChangeEvent, ChangeEventHandler, useCallback, useState } from "react"
import { useDebounce } from "react-use"

type UseDebounceTextInputReturn = {
  debouncedValue: string
  onChange: ChangeEventHandler<Element>
  setValue: (value: string) => void
  value: string
}

const useDebounceTextInput: (initialValue?: string) => UseDebounceTextInputReturn = (initialValue = "") => {
  const [value, setValue] = useState<string>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<string>(initialValue)

  useDebounce(
    () => {
      setDebouncedValue(value)
    },
    300,
    [value],
  )

  const onChange = useCallback((event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value)
  }, [])

  const result = {
    debouncedValue,
    onChange,
    setValue,
    value,
  }

  return result
}

export default useDebounceTextInput
