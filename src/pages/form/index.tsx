import { Container } from '../../components/container'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Separator } from '../../components/ui/separator'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Switch } from '../../components/ui/switch'
import { IoAddOutline, IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import { useGetForm } from '../../hooks/use-get-form'
import { Button } from '../../components/ui/button'
import { Title } from '../../components/title'
import { useUpdateForm } from '../../hooks/use-update-form'
import { useEffect, useState } from 'react'
import { selectItems } from '@/constants/selectItems'
import { GoBack } from '@/components/ui/back-button'
import { Card } from '@/components/ui/card'

export function Form() {
  const { id } = useParams<{ id: string }>()
  const { data: formData, isLoading } = useGetForm(id!)
  const { mutate: updateForm } = useUpdateForm()
  const [isEditing, setIsEditing] = useState(false)
  const [updatedForm, setUpdatedForm] = useState<any | null>(null)

  useEffect(() => {
    if (formData) {
      setUpdatedForm(formData)
    }
  }, [formData])

  const handleNameChange = (value: string) => {
    setUpdatedForm((prev: any) => ({ ...prev, form_name: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setUpdatedForm((prev: any) => ({ ...prev, form_description: value }))
  }

  const handleFieldChange = (index: number, key: string, value: any) => {
    setUpdatedForm((prev: any) => {
      const newFields = [...prev.form_fields]
      newFields[index][key] = value
      return { ...prev, form_fields: newFields }
    })
  }

  const handleAddInput = () => {
    setUpdatedForm((prev: any) => ({
      ...prev,
      form_fields: [
        ...prev.form_fields,
        {
          id: null,
          field_name: '',
          field_type: 'text',
          field_required: false,
          options: [],
        },
      ],
    }))
  }

  const handleRemoveField = (index: number) => {
    setUpdatedForm((prev: any) => {
      const newFields = prev.form_fields.filter(
        (_: any, i: number) => i !== index
      )
      return { ...prev, form_fields: newFields }
    })
  }

  const handleAddOption = (fieldIndex: number) => {
    setUpdatedForm((prev: any) => {
      const newFields = [...prev.form_fields]
      newFields[fieldIndex].options.push('')
      return { ...prev, form_fields: newFields }
    })
  }

  const handleOptionChange = (
    value: string,
    fieldIndex: number,
    optionIndex: number
  ) => {
    setUpdatedForm((prev: any) => {
      const newFields = [...prev.form_fields]
      newFields[fieldIndex].options[optionIndex] = value
      return { ...prev, form_fields: newFields }
    })
  }

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    setUpdatedForm((prev: any) => {
      const newFields = [...prev.form_fields]
      newFields[fieldIndex].options.splice(optionIndex, 1)
      return { ...prev, form_fields: newFields }
    })
  }

  const handleSaveChanges = () => {
    if (id) {
      updateForm({ id, data: updatedForm })
      setIsEditing(false)
    } else {
      console.error('ID do formulário não encontrado')
    }
  }

  if (isLoading || !updatedForm) {
    return (
      <Container className="p-10 flex flex-col items-center">
        <p>Carregando...</p>
      </Container>
    )
  }

  return (
    <Container className="p-10 flex flex-col items-center">
      <div className="w-[1000px]">
        <div className="flex text-gray-600 justify-between mb-5">
          <GoBack />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card
                  className="p-3 cursor-pointer"
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  <IoPencilOutline className="cursor-pointer w-5 h-5" />
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editar formulário</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="mb-5">
          <Title>{updatedForm?.form_name}</Title>
        </div>

        <div className="flex flex-col">
          <Input
            value={updatedForm?.form_name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="mb-5 dark:bg-[#383838] dark:border-[#4b4b4b]"
            disabled={!isEditing}
          />
          <Textarea
            value={updatedForm?.form_description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="mb-5 dark:bg-[#383838] dark:border-[#4b4b4b]"
            disabled={!isEditing}
          />
          <Separator className="mb-5" />
          {updatedForm?.form_fields.map((field: any, index: number) => (
            <div className="flex mb-5" key={index}>
              <div className="w-full">
                <Input
                  className="dark:bg-[#383838] dark:border-[#4b4b4b]"
                  value={field.field_name}
                  onChange={(e) =>
                    handleFieldChange(index, 'field_name', e.target.value)
                  }
                  disabled={!isEditing}
                />
                {field.field_type === 'multiple_choice' && isEditing && (
                  <div className="mt-2">
                    {field.options.map(
                      (option: string, optionIndex: number) => (
                        <div
                          className="flex items-center mb-2 "
                          key={optionIndex}
                        >
                          <Input
                            value={option}
                            placeholder={`Opção ${optionIndex + 1}`}
                            onChange={(e) =>
                              handleOptionChange(
                                e.target.value,
                                index,
                                optionIndex
                              )
                            }
                            className="flex-1"
                            disabled={!isEditing}
                          />
                          <IoTrashOutline
                            onClick={() =>
                              handleRemoveOption(index, optionIndex)
                            }
                            className="cursor-pointer ml-2"
                          />
                        </div>
                      )
                    )}
                    <Button
                      className="mt-2 dark:bg-[#383838] dark:border-[#4b4b4b]"
                      onClick={() => handleAddOption(index)}
                      variant="outline"
                    >
                      Adicionar Opção
                    </Button>
                  </div>
                )}
                {field.field_type === 'dropdown' && isEditing && (
                  <div className="mt-2 ">
                    {field.options.map(
                      (option: string, optionIndex: number) => (
                        <div
                          className="flex items-center mb-2 "
                          key={optionIndex}
                        >
                          <Input
                            value={option}
                            placeholder={`Opção ${optionIndex + 1}`}
                            onChange={(e) =>
                              handleOptionChange(
                                e.target.value,
                                index,
                                optionIndex
                              )
                            }
                            className="flex-1"
                            disabled={!isEditing}
                          />
                          <IoTrashOutline
                            onClick={() =>
                              handleRemoveOption(index, optionIndex)
                            }
                            className="cursor-pointer ml-2"
                          />
                        </div>
                      )
                    )}
                    <Button
                      className="mt-2 dark:bg-[#383838] dark:border-[#4b4b4b]"
                      onClick={() => handleAddOption(index)}
                      variant="outline"
                    >
                      Adicionar Opção
                    </Button>
                  </div>
                )}
                {isEditing && (
                  <div className="flex items-center mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button onClick={() => handleRemoveField(index)}>
                            <IoTrashOutline className="cursor-pointer" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Excluir</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Separator className="h-5 w-[0.7px] mx-2 " />
                    <p className="text-gray-500 text-sm mr-2">
                      Campo obrigatório
                    </p>
                    <Switch
                      checked={field.field_required}
                      onCheckedChange={() =>
                        handleFieldChange(
                          index,
                          'field_required',
                          !field.field_required
                        )
                      }
                    />
                  </div>
                )}
              </div>
              <Select
                value={field.field_type}
                onValueChange={(value) =>
                  handleFieldChange(index, 'field_type', value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger className="w-[190px] ml-2 dark:bg-[#383838]">
                  <SelectValue placeholder="Campos" />
                </SelectTrigger>
                <SelectContent className="w-fit dark:bg-[#383838] dark:text-white">
                  <SelectGroup>
                    {selectItems.map((item) => (
                      <SelectItem
                        value={item.value}
                        key={item.value}
                        className="cursor-pointer "
                      >
                        <div className="flex items-center ">{item.name}</div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          ))}
          {isEditing && (
            <div className="flex justify-end">
              <Button
                onClick={handleSaveChanges}
                className="bg-green-500 hover:bg-green-400"
              >
                Salvar alterações
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="ml-2" onClick={handleAddInput}>
                      <IoAddOutline className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Adicionar campo</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
