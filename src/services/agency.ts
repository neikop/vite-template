import { client } from "./axios"

const fetchAgencies = (params?: PaginateParams): Promise<PaginateResponse<Agency>> =>
  client.get(`/agencies`, { params })
const createAgency = (body: AgencyCreateBody): Promise<Airport> => client.post(`/agencies`, body)

const agencyService = {
  createAgency,
  fetchAgencies,
}

export default agencyService
