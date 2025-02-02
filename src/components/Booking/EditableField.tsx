import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { IoCalendarOutline } from 'react-icons/io5'
import { Calendar } from '@/components/ui/calendar'
import { formateDate } from '../../utils/formate-date'
import { ptBR } from 'date-fns/locale'

type EditableFieldProps = {
  fieldName: string
  fieldType: string
  value: string | Date
  options?: string[]
  isEditing: boolean
  onChange: (key: string, value: string | Date) => void
}

const EditableField: React.FC<EditableFieldProps> = ({
  fieldName,
  fieldType,
  value,
  options,
  isEditing,
  onChange,
}) => {
  switch (fieldType) {
    case 'text':
    case 'number':
      return (
        <div className="mb-4">
          <label className="block mb-2 font-medium">{fieldName}</label>
          <Input
            type={fieldType}
            value={typeof value === 'string' ? value : value.toISOString()}
            onChange={(e) => onChange(fieldName, e.target.value)}
            disabled={!isEditing}
          />
        </div>
      )
    case 'multiple_choice':
      return (
        <div className="mb-4">
          <label className="block mb-2 font-medium">{fieldName}</label>
          <div className="flex flex-col gap-2">
            {options?.map((option, index) => (
              <label key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={fieldName}
                  value={option}
                  checked={value === option}
                  onChange={() => onChange(fieldName, option)}
                  disabled={!isEditing}
                />
                {option}
              </label>
            ))}
          </div>
        </div>
      )
    case 'data':
      return (
        <div className="mb-4">
          <label className="block mb-2 font-medium">{fieldName}</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="flex items-center bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200">
                {value ? formateDate(value as string) : 'Escolha uma data'}
                <IoCalendarOutline className="ml-2 text-gray-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                locale={ptBR}
                mode="single"
                selected={value ? new Date(value) : undefined}
                onSelect={(date) =>
                  date && onChange(fieldName, formateDate(date.toString()))
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      )
    default:
      return null
  }
}

export default EditableField
