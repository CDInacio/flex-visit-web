interface SelectItem {
  name: string
  value: string
}

export const selectItems: SelectItem[] = [
  { name: 'Texto', value: 'text' },
  { name: 'Número', value: 'number' },
  { name: 'Data', value: 'data' },
  { name: 'Múltipla Escolha', value: 'multiple_choice' },
  { name: 'Dropdown', value: 'dropdown' },
]
