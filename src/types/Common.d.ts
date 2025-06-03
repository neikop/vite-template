type Pagination<T> = {
  count: number
  items: T[]
  link: {
    nextToken?: string
  }
}
