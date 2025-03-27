type PopupController = {
  onClose: () => void
  onSuccess?: () => void
}

type SearchController = {
  onChange: (search?: CommonSearch) => void
}
