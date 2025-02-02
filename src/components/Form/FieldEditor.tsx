import React from 'react'
import { Input } from '@/components/ui/input'
import { IoTrashOutline } from 'react-icons/io5'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { selectItems } from '@/constants/selectItems'
import { Separator } from '@radix-ui/react-separator'

type FieldEditorProps = {
  field: any
  index: number
  isEditing: boolean
  onFieldChange: (index: number, key: string, value: any) => void
  onRemoveField: (index: number) => void
  onAddOption: (fieldIndex: number) => void
  onOptionChange: (
    value: string,
    fieldIndex: number,
    optionIndex: number
  ) => void
  onRemoveOption: (fieldIndex: number, optionIndex: number) => void
}

const FieldEditor: React.FC<FieldEditorProps> = ({
  field,
  index,
  isEditing,
  onFieldChange,
  onRemoveField,
  onAddOption,
  onOptionChange,
  onRemoveOption,
}) => {
  return (
    <div className="flex mb-5">
      <div className="w-full">
        <Input
          value={field.field_name}
          onChange={(e) => onFieldChange(index, 'field_name', e.target.value)}
          disabled={!isEditing}
        />
        {field.field_type === 'multiple_choice' && isEditing && (
          <div className="mt-2">
            {field.options.map((option: string, optionIndex: number) => (
              <div className="flex items-center mb-2" key={optionIndex}>
                <Input
                  value={option}
                  placeholder={`Opção ${optionIndex + 1}`}
                  onChange={(e) =>
                    onOptionChange(e.target.value, index, optionIndex)
                  }
                  className="flex-1"
                  disabled={!isEditing}
                />
                <IoTrashOutline
                  onClick={() => onRemoveOption(index, optionIndex)}
                  className="cursor-pointer ml-2"
                />
              </div>
            ))}
            <Button
              className="mt-2"
              onClick={() => onAddOption(index)}
              variant="outline"
            >
              Adicionar Opção
            </Button>
          </div>
        )}
        {isEditing && (
          <div className="flex items-center mt-2">
            <button onClick={() => onRemoveField(index)}>
              <IoTrashOutline className="cursor-pointer" />
            </button>
            <Separator className="h-5 w-[0.7px] mx-2" />
            <Switch
              checked={field.field_required}
              onCheckedChange={() =>
                onFieldChange(index, 'field_required', !field.field_required)
              }
            />
          </div>
        )}
      </div>
      <Select
        value={field.field_type}
        onValueChange={(value) => onFieldChange(index, 'field_type', value)}
        disabled={!isEditing}
      >
        <SelectTrigger className="w-[190px] ml-2">
          <SelectValue placeholder="Campos" />
        </SelectTrigger>
        <SelectContent className="w-fit">
          <SelectGroup>
            {selectItems.map((item) => (
              <SelectItem
                value={item.value}
                key={item.value}
                className="cursor-pointer"
              >
                <div className="flex items-center">{item.name}</div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default FieldEditor
