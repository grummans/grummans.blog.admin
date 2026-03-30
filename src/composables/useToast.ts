import { useToast as useVueToast } from 'vue-toastification'

export function useToast() {
  const toast = useVueToast()

  return {
    // Success notification
    success(message: string) {
      toast.success(message)
    },

    // Error notification
    error(message: string) {
      toast.error(message)
    },

    // Warning notification
    warning(message: string) {
      toast.warning(message)
    },

    // Info notification
    info(message: string) {
      toast.info(message)
    },

    // Clear all toasts
    clear() {
      toast.clear()
    },

    // Dismiss specific toast by ID
    dismiss(id: string | number) {
      toast.dismiss(id)
    },
  }
}
