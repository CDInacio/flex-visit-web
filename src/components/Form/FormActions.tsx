import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { IoAddOutline } from 'react-icons/io5'

type FormActionsProps = {
  isEditing: boolean
  onSaveChanges: () => void
  onAddInput: () => void
}

const FormActions: React.FC<FormActionsProps> = ({
  isEditing,
  onSaveChanges,
  onAddInput,
}) => {
  return (
    <div className="flex justify-end">
      {isEditing && (
        <>
          <Button
            onClick={onSaveChanges}
            className="bg-green-500 hover:bg-green-400"
          >
            Salvar alterações
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="ml-2" onClick={onAddInput}>
                <IoAddOutline className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Adicionar campo</p>
            </TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  )
}

export default FormActions
