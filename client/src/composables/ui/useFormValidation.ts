import { ref } from 'vue'

  interface FieldCheck {
    value: string
    label: string
  }

export const useFormValidation = () => {
  const showValidationModal = ref(false)
  const missingFields = ref<string[]>([])
  const error = ref('')

  const validateForm = (fields: FieldCheck[]): boolean => {
    const missing = fields
      .filter(field => !field.value)
      .map(field => field.label)

    if (missing.length > 0) {
      missingFields.value = missing
      showValidationModal.value = true
      return false
    }
    return true
  }

  const getInputValue = (selector: string): string => 
    (document.querySelector(`input[placeholder="${selector}"]`) as HTMLInputElement)?.value.trim() ?? ''

  return {
    showValidationModal,
    missingFields,
    error,
    validateForm,
    getInputValue
  }
}