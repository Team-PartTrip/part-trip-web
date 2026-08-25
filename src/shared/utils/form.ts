import type { ChangeEvent } from 'react'
import type { FieldErrors, FieldValues, UseFormRegisterReturn } from 'react-hook-form'

export const trimFormValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

export function getFirstErrorMessage<TFormValues extends FieldValues>(
  errors: FieldErrors<TFormValues>,
) {
  const firstError = Object.values(errors)[0]

  if (
    firstError &&
    typeof firstError === 'object' &&
    'message' in firstError &&
    typeof firstError.message === 'string'
  ) {
    return firstError.message
  }

  return '입력값을 확인해주세요.'
}

export const createSanitizedChangeHandler =
  (
    registration: UseFormRegisterReturn,
    sanitize: (value: string) => string,
  ) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.value = sanitize(event.currentTarget.value)
    void registration.onChange(event)
  }
