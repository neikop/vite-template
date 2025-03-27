import { useCallback, useState } from "react"

type CommonSearch = {
  [key: string]: unknown
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: SortDirectionType
}

const useSearch = (search?: CommonSearch) => {
  const [dataSearch, setDataSearch] = useState<CommonSearch>({
    page: 1,
    size: 10,
    sortBy: "createdAt",
    sortDirection: "desc",
    ...search,
  })

  const onSearchChange = useCallback((search?: CommonSearch) => {
    setDataSearch((current) => {
      return {
        ...current,
        page: 1,
        ...search,
      }
    })
  }, [])

  return { dataSearch, onSearchChange }
}

export default useSearch
