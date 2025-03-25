type ByID = {
  id: number | string
}

type DBTimeAudit = {
  createdAt: ISODateString
  createdBy?: number
  updatedAt: ISODateString
  updatedBy?: number
}

type ISODateString = string

type LuxonDate = any
