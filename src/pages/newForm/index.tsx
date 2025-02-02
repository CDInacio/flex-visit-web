import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { IoAddOutline, IoTrashOutline } from 'react-icons/io5'
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
import { Switch } from '@/components/ui/switch'
import { motion, AnimatePresence } from 'framer-motion'
import { Separator } from '@/components/ui/separator'
import { useCreateForm } from '@/hooks/use-create-form.hook'
import { useToast } from '@/components/ui/use-toast'
import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { Title } from '../../components/title'
import { selectItems } from '@/constants/selectItems'
import { GoBack } from '@/components/ui/back-button'

type FormField = {
  field_type: string
  field_name: string
  field_required: boolean
  options?: string[]
}

type FormInputs = {
  form_name: string
  form_description: string
  form_fields: FormField[]
}

export function NewForm() {
  const [inputs, setInputs] = useState<FormInputs>({
    form_name: '',
    form_description: '',
    form_fields: [],
  })

  const { mutate: createForm, isPending: isLoading } = useCreateForm()
  const { toast: t } = useToast()

  const handleAddInput = () => {
    setInputs((prev) => ({
      ...prev,
      form_fields: [
        ...prev.form_fields,
        {
          field_type: '',
          field_name: '',
          field_required: false,
          options: [],
        },
      ],
    }))
  }

  const handleRemove = (index: number) => {
    const updatedFields = [...inputs.form_fields]
    updatedFields.splice(index, 1)
    setInputs((prev) => ({ ...prev, form_fields: updatedFields }))
  }

  const handleQuestionChange = (value: string, index: number) => {
    const updatedFields = [...inputs.form_fields]
    updatedFields[index].field_name = value
    setInputs((prev) => ({ ...prev, form_fields: updatedFields }))
  }

  const handleSelectChange = (value: string, index: number) => {
    const updatedFields = [...inputs.form_fields]
    updatedFields[index].field_type = value
    if (value === 'dropdown' || value === 'multiple_choice') {
      updatedFields[index].options = updatedFields[index].options || []
    } else {
      updatedFields[index].options = undefined
    }

    setInputs((prev) => ({ ...prev, form_fields: updatedFields }))
  }

  const handleRequiredChange = (index: number) => {
    const updatedFields = [...inputs.form_fields]
    updatedFields[index].field_required = !updatedFields[index].field_required
    setInputs((prev) => ({ ...prev, form_fields: updatedFields }))
  }

  const handleAddOption = (index: number) => {
    setInputs((prev) => {
      const updatedFields = [...prev.form_fields]

      if (
        updatedFields[index].field_type === 'dropdown' ||
        updatedFields[index].field_type === 'multiple_choice'
      ) {
        updatedFields[index].options = [
          ...(updatedFields[index].options ?? []),
          '',
        ]

        return { ...prev, form_fields: updatedFields }
      }

      return prev
    })
  }

  const handleOptionChange = (
    value: string,
    fieldIndex: number,
    optionIndex: number
  ) => {
    const updatedFields = [...inputs.form_fields]
    if (
      updatedFields[fieldIndex].field_type === 'dropdown' ||
      updatedFields[fieldIndex].field_type === 'multiple_choice'
    ) {
      updatedFields[fieldIndex].options![optionIndex] = value
      setInputs((prev) => ({ ...prev, form_fields: updatedFields }))
    }
  }

  const handleRemoveOption = (fieldIndex: number, optionIndex: number) => {
    const updatedFields = [...inputs.form_fields]
    if (
      updatedFields[fieldIndex].field_type === 'dropdown' ||
      updatedFields[fieldIndex].field_type === 'multiple_choice'
    ) {
      updatedFields[fieldIndex].options!.splice(optionIndex, 1)
      setInputs((prev) => ({ ...prev, form_fields: updatedFields }))
    }
  }

  const handleNameChange = (value: string) => {
    setInputs((prev) => ({ ...prev, form_name: value }))
  }

  const handleDescriptionChange = (value: string) => {
    setInputs((prev) => ({ ...prev, form_description: value }))
  }

  const handleClearForm = () => {
    setInputs({
      form_name: '',
      form_description: '',
      form_fields: [],
    })
  }

  const handleCreateForm = async () => {
    if (
      inputs.form_fields.length >= 1 &&
      (!inputs.form_fields[0].field_type || !inputs.form_fields[0].field_name)
    ) {
      t({
        variant: 'destructive',
        title: 'Erro!',
        description:
          'Você precisa adicionar pelo menos uma pergunta ao formulário.',
      })
      return
    }

    // if (
    //   inputs.form_fields.some(
    //     (field) =>
    //       field.field_type === 'multiple_choice' &&
    //       (!field.options || field.options.length < 2)
    //   )
    // ) {
    //   t({
    //     variant: 'destructive',
    //     title: 'Erro!',
    //     description:
    //       'Os campos de múltipla escolha precisam ter pelo menos duas opções.',
    //   })
    //   return
    // }

    if (
      inputs.form_fields.some(
        (field) =>
          field.field_type === 'dropdown' &&
          (!field.options || field.options.length < 1)
      )
    ) {
      t({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Os campos de dropdown precisam ter pelo menos uma opção.',
      })
      return
    }

    if (!inputs.form_name || !inputs.form_description) {
      t({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Você precisa preencher todos os campos.',
      })
      return
    }
    createForm(inputs)
    handleClearForm()
  }

  useEffect(() => {
    if (isLoading) {
      t({
        variant: 'default',
        title: 'Criando formulário',
        description: 'Aguarde um momento...',
      })
    }
  }, [isLoading])

  return (
    <Container className="p-10  flex flex-col items-center">
      <div className="w-[1000px]">
        <GoBack />
        <div className="my-5">
          <Title>Novo Formulário</Title>
        </div>
        <div className="flex flex-col">
          <Input
            placeholder="Nome do formulário"
            value={inputs.form_name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
          <Textarea
            placeholder="Descrição"
            className="mt-3"
            value={inputs.form_description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
          />
          <Separator className="my-5" />
          <AnimatePresence>
            {inputs?.form_fields?.map((field, index: number) => (
              <motion.div
                className="flex mb-5"
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex-1">
                  <Input
                    value={field.field_name}
                    placeholder="Pergunta"
                    onChange={(e) =>
                      handleQuestionChange(e.target.value, index)
                    }
                  />
                  {(field.field_type === 'multiple_choice' ||
                    field.field_type === 'dropdown') && (
                    <div className="mt-2">
                      {field.options?.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center mb-2"
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
                          />
                          <IoTrashOutline
                            onClick={() =>
                              handleRemoveOption(index, optionIndex)
                            }
                            className="cursor-pointer ml-2"
                          />
                        </div>
                      ))}
                      <Button
                        className="mt-2"
                        onClick={() => handleAddOption(index)}
                        variant="outline"
                      >
                        Adicionar Opção
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div>
                            <IoTrashOutline
                              onClick={() => handleRemove(index)}
                              className="cursor-pointer"
                            />
                          </div>
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
                      onCheckedChange={() => handleRequiredChange(index)}
                    />
                  </div>
                </div>
                <Select
                  onValueChange={(value) => handleSelectChange(value, index)}
                  value={field.field_type}
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
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="flex justify-end">
          <Button
            className="bg-green-500 hover:bg-green-400"
            onClick={handleCreateForm}
          >
            Criar
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
      </div>
    </Container>
  )
}
