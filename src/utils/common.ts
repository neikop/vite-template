import { DateTime } from "luxon"

export const formatCurrency = (number?: number) => {
  return new Intl.NumberFormat(navigator.language).format(number ?? 0)
}

export const formatDateTime = (time?: string, format = "dd/MM/yyyy HH:mm") => {
  return time ? DateTime.fromISO(time).toFormat(format) : ""
}

export const formatDateWithTimeZone = (
  time: string,
  timezone: string = "Asia/Ho_Chi_Minh",
  format: string = "dd/MM/yyyy HH:mm",
) => {
  return time ? DateTime.fromISO(time, { zone: timezone }).toFormat(format) : ""
}

export const formatDate = (time: string) => {
  return DateTime.fromISO(time).toFormat("dd/MM/yyyy")
}

export const formatFlightTrip = (inputValue: string) => {
  if (/^[A-Z]{3}-$/.test(inputValue)) {
    return inputValue
  }
  // Remove non-letter characters
  const letterValue = inputValue.toUpperCase().replace(/[^A-Z]/g, "")

  // Automatically add "-" after the first 3 characters
  let formattedValue = letterValue
  if (letterValue.length > 3) {
    formattedValue = letterValue.slice(0, 3) + "-" + letterValue.slice(3)
  }

  // Limit 7 characters for XXX-XXX
  return formattedValue.slice(0, 7)
}

export const formatFlightTripUpperCase = (inputValue: string): string => {
  const letterValue = inputValue.toUpperCase().replace(/[^A-Z]/g, "")
  return letterValue.slice(0, 3)
}

export const formatRemoveAccents = (inputValue: string): string => {
  const letterValue = inputValue
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")

  return letterValue
}

export const formatDuplicateTrim = (inputValue: string) => {
  return inputValue.replace(/(\s+|\s*,\s*)/g, " ").trim()
}

export const formatTextAndNumberAndUpperCase = (inputValue: string): string => {
  const letterValue = inputValue.toUpperCase().replace(/[^A-Z0-9]/g, "")
  return letterValue
}

export const convertDataUrlToFile = (dataUrl: string, fileName?: string): File => {
  let arr = dataUrl.split(","),
    mime = arr[0]?.match(/:(.*?);/)?.[1],
    bstr = atob(arr[arr.length - 1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName ?? "image.png", { type: mime })
}

export const reduceImageFile = (file: File) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = function (event) {
      const img = new Image()
      img.src = event.target?.result as string
      img.onload = function () {
        const canvas: HTMLCanvasElement = document.createElement("canvas")
        const context = canvas.getContext("2d")

        const maxWidth = 600
        const maxHeight = 600
        let newWidth, newHeight

        if (img.width > img.height) {
          newWidth = maxWidth
          newHeight = (maxWidth / img.width) * img.height
        } else {
          newHeight = maxHeight
          newWidth = (maxHeight / img.height) * img.width
        }

        canvas.width = newWidth
        canvas.height = newHeight

        context?.drawImage(img, 0, 0, newWidth, newHeight)
        context?.canvas.toBlob(
          (blob) => {
            const newFile = new File([blob!], file.name, {
              lastModified: file.lastModified,
              type: file.type,
            })
            resolve(newFile)
          },
          file.type,
          1,
        )
      }
    }
    reader.readAsDataURL(file)
  })
}

export const domesticIATACodes = [
  "HAN",
  "SGN",
  "DAD",
  "PQC",
  "CXR",
  "CAH",
  "VCA",
  "VCL",
  "VCS",
  "DLI",
  "DIN",
  "VDH",
  "HPH",
  "HUI",
  "PXU",
  "UIH",
  "VKG",
  "THD",
  "VII",
  "TBB",
  "VDO",
  "NHA",
  "BMV",
  "PHA",
  "PHH",
  "SQH",
  "VTG",
]

export function isDomesticFlight(departure: string, arrival: string) {
  if (!departure || !arrival) return false
  return domesticIATACodes.includes(departure) && domesticIATACodes.includes(arrival)
}

export function compareDateBySubtract(thisDate: Date | string, subtract: SubtractParams): CompareResult {
  const now = DateTime.now()
  let dateItem = DateTime.fromJSDate(new Date(thisDate))
  if (subtract.subtractValue) {
    dateItem = dateItem.minus({ [subtract.subtractType]: subtract.subtractValue })
  }
  const isBefore = dateItem < now
  const isSame = dateItem.hasSame(now, subtract.subtractType)
  const isAfter = dateItem > now
  return {
    isAfter,
    isBefore,
    isSame,
  }
}
