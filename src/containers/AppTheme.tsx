import type {} from "@mui/x-data-grid/themeAugmentation"

import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material"
import { CssBaseline, LinearProgress, PaletteMode, ThemeProvider } from "@mui/material"
import { createTheme, responsiveFontSizes } from "@mui/material/styles"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon"
import { GridEmpty, GridFooter } from "components/common"
import { PropsWithChildren, useEffect } from "react"
import { useSelector } from "react-redux"
import { themeSelector } from "reducers/themeSlice"

const createAppTheme = (mode?: PaletteMode) =>
  createTheme({
    breakpoints: {
      values: {
        lg: 1200,
        md: 900,
        sm: 600,
        xl: 1600,
        xs: 0,
      },
    },
    components: {
      MuiAlert: {
        styleOverrides: {
          message: {
            fontSize: 16,
            fontWeight: 700,
          },
        },
      },
      MuiButton: {
        defaultProps: {
          color: "primary",
          disableElevation: true,
          size: "medium",
          variant: "outlined",
        },
        styleOverrides: {
          sizeLarge: { fontSize: 18, minHeight: 48, minWidth: 48 },
          sizeMedium: { fontSize: 16, minHeight: 40, minWidth: 40 },
          sizeSmall: { fontSize: 14, minHeight: 32, minWidth: 32 },
        },
      },
      MuiCard: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiChip: {
        defaultProps: {
          variant: "outlined",
        },
      },
      MuiContainer: {
        defaultProps: {
          maxWidth: "lg",
        },
      },
      MuiDataGrid: {
        defaultProps: {
          autoHeight: false,
          disableColumnMenu: true,
          getRowHeight: () => "auto",
          pageSizeOptions: [10, 20, 50, 100],
          paginationMode: "server",
          rowSelection: false,
          showCellVerticalBorder: true,
          showColumnVerticalBorder: true,
          slots: {
            columnSortedAscendingIcon: ArrowDropUp,
            columnSortedDescendingIcon: ArrowDropDown,
            footer: GridFooter,
            loadingOverlay: LinearProgress,
            noRowsOverlay: GridEmpty,
          },
          sortingMode: "server",
          sortingOrder: ["desc", "asc", null],
        },
      },
      MuiDialog: {
        defaultProps: {
          fullWidth: true,
          maxWidth: "sm",
        },
      },
      MuiPagination: {
        defaultProps: {
          shape: "rounded",
          variant: "outlined",
        },
      },
      MuiTextField: {
        defaultProps: {
          InputLabelProps: { shrink: true },
          size: "medium",
          variant: "outlined",
        },
      },
      MuiTooltip: {
        defaultProps: {
          arrow: true,
        },
        styleOverrides: {
          tooltip: {
            fontSize: 14,
          },
        },
      },
      MuiTypography: {
        defaultProps: {
          component: "div",
        },
      },
    },
    palette: {
      mode,
      primary: {
        main: "#019CB4",
      },
      secondary: {
        main: "#003CA6",
      },
    },
    shape: {
      borderRadius: 4,
    },
    typography: {
      button: { fontWeight: 700, textTransform: "none" },
      fontFamily: "Nunito Sans",
      h1: { fontSize: 48, fontWeight: 700, lineHeight: 1.2 },
      h2: { fontSize: 36, fontWeight: 700, lineHeight: 1.2 },
      h3: { fontSize: 30, fontWeight: 700, lineHeight: 1.2 },
      h4: { fontSize: 24, fontWeight: 700, lineHeight: 1.2 },
      h5: { fontSize: 20, fontWeight: 700, lineHeight: 1.2 },
      h6: { fontSize: 18, fontWeight: 700, lineHeight: 1.2 },
      subtitle1: { fontSize: 16, fontWeight: 700, lineHeight: 1.2 },
      subtitle2: { fontSize: 14, fontWeight: 700, lineHeight: 1.2 },
    },
  })

const AppTheme = ({ children }: PropsWithChildren) => {
  const { mode } = useSelector(themeSelector)

  useEffect(() => {
    document.body.dataset.theme = mode
    document.body.className = mode
  }, [mode])

  return (
    <ThemeProvider theme={responsiveFontSizes(createAppTheme(mode))}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <CssBaseline />
        {children}
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default AppTheme
