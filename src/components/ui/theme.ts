/* eslint-disable perfectionist/sort-objects */
import { createSystem, defaultConfig, mergeConfigs } from "@chakra-ui/react"

const config = mergeConfigs(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: {
          50: { value: "#f3e5f5" },
          100: { value: "#e1bee7" },
          200: { value: "#ce93d8" },
          300: { value: "#ba68c8" },
          400: { value: "#ab47bc" },
          500: { value: "#9c27b0" },
          600: { value: "#8e24aa" },
          700: { value: "#7b1fa2" },
          800: { value: "#6a1b9a" },
          900: { value: "#4a148c" },
        },
      },
      sizes: {
        13: { value: "3.25rem" },
        15: { value: "3.75rem" },
      },
    },
  },
})

export const chakraSystem = createSystem(config)
