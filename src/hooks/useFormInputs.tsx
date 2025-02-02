import { useReducer, useRef, useCallback, useEffect } from 'react'
import { toast } from 'sonner'
import { InputAction, InputState } from '../types/inputs.type'

function inputsReducer(state: InputState, action: InputAction): InputState {
  switch (action.type) {
    case 'ADD_INPUT':
      return {
        ...state,
        form_fields: [
          ...state.form_fields,
          { field_type: '', field_name: '', field_required: false },
        ],
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
            return { ...item, field_type: action.value }
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
    case 'UNDO':
      return action.index !== null
        ? { ...state, form_fields: action.value }
        : state
    case 'CLEAR_FORM':
      return { form_name: '', form_description: '', form_fields: [] }
    default:
      return state
  }
}

export function useFormInputs(initialState?: InputState) {
  const defaultState: InputState = initialState || {
    form_name: '',
    form_description: '',
    form_fields: [{ field_type: '', field_name: '', field_required: false }],
  }

  const [inputs, dispatch] = useReducer(inputsReducer, defaultState)
  const previousStateRef = useRef<InputState['form_fields']>([])
  const undoIndexRef = useRef<number | null>(null)

  useEffect(() => {
    localStorage.setItem('inputs', JSON.stringify(inputs))
  }, [inputs])

  const handleSelectChange = useCallback(
    (value: string, index: number) => {
      dispatch({ type: 'SELECT_CHANGE', value, index })
    },
    [dispatch]
  )

  const handleQuestionChange = useCallback(
    (value: string, index: number) => {
      dispatch({ type: 'QUESTION_CHANGE', value, index })
    },
    [dispatch]
  )

  const handleAddInput = useCallback(() => {
    dispatch({ type: 'ADD_INPUT' })
  }, [dispatch])

  const handleRequiredChange = useCallback(
    (index: number) => {
      dispatch({ type: 'REQUIRED_CHANGE', index })
    },
    [dispatch]
  )

  const handleRemove = (index: number) => {
    previousStateRef.current = [...inputs.form_fields]
    undoIndexRef.current = index

    toast('Campo removido.', {
      description: 'Você removeu um campo do formulário.',
      action: {
        label: 'Desfazer',
        onClick: () => {
          if (undoIndexRef.current !== null) {
            dispatch({
              type: 'UNDO',
              value: previousStateRef.current,
              index: undoIndexRef.current,
            })
            undoIndexRef.current = null
          }
        },
      },
    })

    dispatch({ type: 'REMOVE_INPUT', index })
  }

  const handleNameChange = (value: string) => {
    dispatch({ type: 'ADD_NAME', value }) // Função para alterar o nome
  }

  const handleDescriptionChange = (value: string) => {
    dispatch({ type: 'ADD_DESCRIPTION', value }) // Função para alterar a descrição
  }

  const handleClearForm = useCallback(() => {
    dispatch({ type: 'CLEAR_FORM' })
  }, [])

  return {
    inputs,
    handleSelectChange,
    handleQuestionChange,
    handleAddInput,
    handleRequiredChange,
    handleRemove,
    handleClearForm,
    handleNameChange,
    handleDescriptionChange, // Retorna as novas funções
  }
}
