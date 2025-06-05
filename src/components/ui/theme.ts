/* eslint-disable perfectionist/sort-objects */
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

import { buttonRecipe } from "./button.recipe"

const config = defineConfig({
  globalCss: {},
  theme: {
    recipes: {
      button: buttonRecipe,
    },
    tokens: {
      colors: {
        bg: {
          purple: { value: "{colors.purple.50}" },
        },
      },
      sizes: {
        13: { value: "3.25rem" },
        15: { value: "3.75rem" },
      },
    },
    semanticTokens: {
      colors: {
        primary: {
          main: { value: "{colors.purple.500}" },
          dark: { value: "{colors.purple.600}" },
        },
      },
    },
  },
})

export default createSystem(defaultConfig, config)
