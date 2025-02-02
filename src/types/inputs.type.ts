import {} from '../types/inputs.type'

export type InputAction =
  | { type: 'ADD_INPUT' }
  | { type: 'ADD_DESCRIPTION'; value: string }
  | { type: 'QUESTION_CHANGE'; value: string; index: number }
  | { type: 'SELECT_CHANGE'; value: string; index: number }
  | { type: 'REQUIRED_CHANGE'; index: number }
  | { type: 'REMOVE_INPUT'; index: number }
  | { type: 'UNDO'; value: InputState['form_fields']; index: number }
  | { type: 'ADD_NAME'; value: string }
  | { type: 'CLEAR_FORM' }
  | { type: 'SET_FORM'; value: InputState }
  | { type: 'ADD_OPTION'; index: number } // Adicionado
  | { type: 'CHANGE_OPTION'; value: string; index: number; optionIndex: number } // Adicionado
  | { type: 'REMOVE_OPTION'; index: number; optionIndex: number } // Adicionado


export interface InputState {
  form_name: string
  form_description: string
  form_fields: {
    field_type: string
    field_name: string
    field_required: boolean
    options?: string[] 
  }[]
}
export interface InputState {
  form_name: string
  form_description: string
  form_fields: {
    field_type: string
    field_name: string
    field_required: boolean
    options?: string[] 
  }[]
}
