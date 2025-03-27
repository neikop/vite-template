import { client } from "./axios"

const uploadFile = ({ formData }: { formData: FormData }): Promise<{ url: string }> =>
  client.post(`/files/upload`, formData)

const fileService = {
  uploadFile,
}

export default fileService
