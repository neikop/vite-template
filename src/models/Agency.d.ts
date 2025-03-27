type Agency = DBTimeAudit & {
  code: string
  id: number
  name: string
}

type AgencyParams = {
  agencyId?: number | string
}

type AgencyCreateBody = {
  code?: string
  name: string
}

type ApiKeyData = {
  base64: string
}
