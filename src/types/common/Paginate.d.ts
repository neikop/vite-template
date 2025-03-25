type PaginateParams = {
  page?: number
  searchText?: string
  size?: number
  sortBy?: string
  sortDirection?: SortDirectionType
}

type PaginateResponse<T> = {
  items: T[]
  page: number
  pulling?: boolean
  size: number
  sortBy?: string
  sortDirection?: SortDirectionType
  total: number
}

type SortDirectionType = "asc" | "desc" | null
