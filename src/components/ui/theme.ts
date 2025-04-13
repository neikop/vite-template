/* eslint-disable perfectionist/sort-objects */
import { createSystem, defaultConfig, defineConfig, mergeConfigs } from "@chakra-ui/react"

const config = mergeConfigs(
  defaultConfig,
  defineConfig({
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
          second: {
            95: { value: "#f3fbfe" },
            90: { value: "#d0f0f8" },
            80: { value: "#a2e1f2" },
            70: { value: "#73d1eb" },
            60: { value: "#45c2e5" },
            50: { value: "#16b3de" },
            40: { value: "#118fb2" },
            30: { value: "#0d7390" },
            20: { value: "#0a5a6e" },
            10: { value: "#083f4e" },
            "05": { value: "#00232d" },
          },
          third: {
            95: { value: "#f4f4f7" },
            90: { value: "#d2d2df" },
            80: { value: "#a6a5bf" },
            70: { value: "#79789f" },
            60: { value: "#4d4b7f" },
            50: { value: "#201d5e" },
            40: { value: "#1a184c" },
            30: { value: "#15133e" },
            20: { value: "#100f2f" },
            10: { value: "#0b0b22" },
            "05": { value: "#020413" },
          },
          terr: {
            95: { value: "#f2fdfe" },
            90: { value: "#ccf9fb" },
            80: { value: "#99f3f7" },
            70: { value: "#66ecf2" },
            60: { value: "#33e6ee" },
            50: { value: "#00e0ea" },
            40: { value: "#00b3bb" },
            30: { value: "#009298" },
            20: { value: "#007075" },
            10: { value: "#004e52" },
            "05": { value: "#002d2f" },
          },
        },
        sizes: {
          13: { value: "3.25rem" },
          15: { value: "3.75rem" },
        },
      },
    },
  }),
)

export const chakraSystem = createSystem(config)
