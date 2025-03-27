type ISODateString = string

type ByID = {
  id: number | string
}

type DBTimeAudit = {
  createdAt: ISODateString
  createdBy?: number
  updatedAt: ISODateString
  updatedBy?: number
}

type PrivateRoute = {
  [key: string]: {
    component: ReactNode
    name?: string
    path: string
    requiredPermission?: string
    url?: (...args: any) => string
  }
}

type DateTimeUnit = "day" | "hour" | "millisecond" | "minute" | "month" | "second" | "week" | "year"

type SubtractParams = {
  subtractType: DateTimeUnit
  subtractValue?: number
}

type CompareResult = {
  isAfter: boolean
  isBefore: boolean
  isSame: boolean
}

type LuxonDate = any
