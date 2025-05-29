export const modalCount = () => Number(localStorage.getItem("modalCount") || "0")

export const modalMax = () => Number(localStorage.getItem("modalMax") || "0")

export const addModal = () => {
  const currentCount = modalCount()
  localStorage.setItem("modalCount", `${currentCount + 1}`)

  const max = modalMax()
  localStorage.setItem("modalMax", `${max + 1}`)
}

export const closeModal = () => {
  const currentCount = modalCount()
  localStorage.setItem("modalCount", `${Math.max(0, currentCount - 1)}`)
}
