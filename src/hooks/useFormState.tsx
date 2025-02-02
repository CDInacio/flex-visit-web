import { useEffect, useReducer } from 'react'
import { InputAction, InputState } from '../types/inputs.type'

const initialState: InputState = {
  form_name: '',
  form_description: '',
  form_fields: [],
}

function inputsReducer(state: InputState, action: InputAction): InputState {
  switch (action.type) {
    case 'ADD_INPUT':
      return {
        ...state,
        form_fields: [
          ...state.form_fields,
          {
            field_type: '',
            field_name: '',
            field_required: false,
            options: [], // Adicionado para suportar múltipla escolha
          },
        ],
      }
    case 'ADD_OPTION':
      return {
        ...state,
        form_fields: state.form_fields.map((item, index: number) => {
          if (index === action.index) {
            return {
              ...item,
              options: [...(item.options || []), ''],
            }
          }
          return item
        }),
      }
    case 'CHANGE_OPTION':
      return {
        ...state,
        form_fields: state.form_fields.map((item, index: number) => {
          if (index === action.index) {
            const updatedOptions = [...(item.options || [])]
            updatedOptions[action.optionIndex] = action.value
            return {
              ...item,
              options: updatedOptions,
            }
          }
          return item
        }),
      }
    case 'REMOVE_OPTION':
      return {
        ...state,
        form_fields: state.form_fields.map((item, index: number) => {
          if (index === action.index) {
            const updatedOptions = (item.options || []).filter(
              (_, optIndex) => optIndex !== action.optionIndex
            )
            return {
              ...item,
              options: updatedOptions,
            }
          }
          return item
        }),
      }
    case 'ADD_NAME':
      return { ...state, form_name: action.value }
    case 'ADD_DESCRIPTION':
      return { ...state, form_description: action.value }
    case 'QUESTION_CHANGE':
      return {
        ...state,
        form_fields: state.form_fields.map((item, index: number) => {
          if (index === action.index) {
            return { ...item, field_name: action.value }
          }
          return item
        }),
      }
    case 'SELECT_CHANGE':
      return {
        ...state,
        form_fields: state.form_fields.map((item, index: number) => {
          if (index === action.index) {
            return {
              ...item,
              field_type: action.value,
              options: action.value === 'multiple_choice' ? [] : undefined,
            }
          }
          return item
        }),
      }
    case 'REQUIRED_CHANGE':
      return {
        ...state,
        form_fields: state.form_fields.map((item, index: number) => {
          if (index === action.index) {
            return { ...item, field_required: !item.field_required }
          }
          return item
        }),
      }
    case 'REMOVE_INPUT':
      return {
        ...state,
        form_fields: state.form_fields.filter(
          (_, index: number) => action.index !== index
        ),
      }
    case 'SET_FORM':
      return action.value
    case 'CLEAR_FORM':
      return initialState
    default:
      return state
  }
}

export function useFormState(formData: InputState | null) {
  const [updatedForm, dispatch] = useReducer(
    inputsReducer,
    formData || initialState
  )

  useEffect(() => {
    if (formData) {
      dispatch({ type: 'SET_FORM', value: formData })
    }
  }, [formData])

  const handleAddOption = (index: number) => {
    dispatch({ type: 'ADD_OPTION', index })
  }

  const handleOptionChange = (
    value: string,
    index: number,
    optionIndex: number
  ) => {
    dispatch({ type: 'CHANGE_OPTION', value, index, optionIndex })
  }

  const handleRemoveOption = (index: number, optionIndex: number) => {
    dispatch({ type: 'REMOVE_OPTION', index, optionIndex })
  }

  const handleSelectChange = (value: string, index: number) => {
    dispatch({ type: 'SELECT_CHANGE', value, index })
  }

  const handleRemove = (index: number) => {
    dispatch({ type: 'REMOVE_INPUT', index })
  }

  const handleQuestionChange = (value: string, index: number) => {
    dispatch({ type: 'QUESTION_CHANGE', value, index })
  }

  const handleAddInput = () => {
    dispatch({ type: 'ADD_INPUT' })
  }

  const handleRequiredChange = (index: number) => {
    dispatch({ type: 'REQUIRED_CHANGE', index })
  }

  const handleNameChange = (value: string) => {
    dispatch({ type: 'ADD_NAME', value })
  }

  const handleDescriptionChange = (value: string) => {
    dispatch({ type: 'ADD_DESCRIPTION', value })
  }

  const handleClearForm = () => {
    dispatch({ type: 'CLEAR_FORM' })
  }

  return {
    updatedForm,
    handleRemove,
    handleSelectChange,
    handleQuestionChange,
    handleAddInput,
    handleRequiredChange,
    handleNameChange,
    handleDescriptionChange,
    handleClearForm,
    handleAddOption,
    handleOptionChange,
    handleRemoveOption,
  }
}
