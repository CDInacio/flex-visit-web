import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ptBR } from 'date-fns/locale'

import { useGetForms } from '../../hooks/use-get-forms.hook'
import { useEffect, useState } from 'react'
import { useCreateBooking } from '../../hooks/use-create-booking'
import { cn } from '../../lib/utils'
import { Container } from '../../components/container'
import { Title } from '../../components/title'
import { Calendar } from '../../components/ui/calendar'
import { Subtitle } from '../../components/subtitle'
import { IoChevronBack } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { Dates, Timeslot } from '../../types/date.type'
import { useToast } from '../../components/ui/use-toast'
import { useGetSchedule } from '@/hooks/use-get-schedule'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { GoBack } from '@/components/ui/back-button'

interface Form {
  [key: string]: unknown
}

interface FormField {
  id: string
  field_name: string
  field_type: string
  field_required: boolean
  formId: string
  options?: string[]
}

export function NewBooking() {
  const navigate = useNavigate()
  const { data: form, isLoading } = useGetForms()
  const { toast } = useToast()
  const [formData, setFormData] = useState<Form>({})
  const [avaliableSlots, setAvaliableSlots] = useState<Timeslot[]>([])
  const { data: dates } = useGetSchedule()
  const userForm = form?.filter((f: any) => f.isActive === true)[0]
  const { mutate: book, isPending: isLoadingCreateBooking } = useCreateBooking()

  const handleBooking = () => {
    let hasMissingFields = false
    let missingFields: string[] = []

    userForm?.form_fields.forEach((field: FormField) => {
      let fieldValue = formData[field.field_name]

      if (field.field_name === 'Data') {
        fieldValue = formData[field.field_name.toLowerCase()]
      }

      if (
        field.field_required &&
        Array.isArray(fieldValue) &&
        fieldValue.length === 0
      ) {
        hasMissingFields = true
        missingFields.push(field.field_name)
      } else if (
        field.field_required &&
        (fieldValue === undefined || fieldValue === '')
      ) {
        hasMissingFields = true
        missingFields.push(field.field_name)
      }
    })

    if (hasMissingFields) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`,
      })
      return
    }

    if (avaliableSlots.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: 'Não há horários disponíveis para a data selecionada.',
      })
      return
    }

    const data = {
      formId: userForm.id,
      ...formData,
    }

    book(data, {
      onSuccess: () => {
        setFormData({})
        setAvaliableSlots([])
        toast({
          variant: 'success',
          title: 'Agendamento realizado!',
          description: 'Seu agendamento foi realizado com sucesso.',
        })
      },
      onError: (e) => {
        console.log(e)
      },
    })
  }

  const handleGoBack = () => {
    navigate('/agendamentos')
  }

  const handleDateSelect = (data: Date | undefined) => {
    const today = new Date()
    if (data && data < today) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Você não pode selecionar uma data anterior à data atual',
      })
      return
    }

    const formattedDate = format(data as Date, 'dd/MM/yyyy', { locale: ptBR })

    setFormData({
      ...formData,
      data: formattedDate,
    })
  }

  useEffect(() => {
    if (formData.data && dates) {
      const matchingTimeslots = dates
        .filter((schedule: Dates) => {
          return schedule.date === formData.data
        })
        .flatMap((schedule: Dates) => schedule.timeslots)

      setAvaliableSlots(matchingTimeslots)
    }
  }, [formData.data, dates])

  useEffect(() => {
    if (isLoadingCreateBooking) {
      toast({
        variant: 'default',
        title: 'Realizando agendamento',
        description: 'Aguarde um momento...',
      })
    }
  }, [isLoading])

  const handleMultipleChoiceChange = (fieldName: string, option: string) => {
    setFormData((prevData) => {
      const selectedOptions: string[] = Array.isArray(prevData[fieldName])
        ? (prevData[fieldName] as string[])
        : []

      const newOptions = selectedOptions.includes(option)
        ? selectedOptions.filter((item) => item !== option)
        : [...selectedOptions, option]

      return {
        ...prevData,
        [fieldName]: newOptions,
      }
    })
  }

  return (
    <Container className="p-10  flex flex-col items-center">
      <div className="w-[900px]">
        <div className="mb-5">
          <GoBack />
        </div>
        {isLoading ? (
          <div className="w-[1000px] mt-5 flex flex-col gap-5">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        ) : (
          <>
            <Title>{userForm?.form_name}</Title>
            <Subtitle>
              <p className="text-justify">{userForm?.form_description}</p>
            </Subtitle>
            <div className="mt-5 ">
              {userForm?.form_fields.map((item: FormField, i: number) => (
                <div className="my-3" key={item.field_name + i}>
                  {/* Campos de texto e número */}
                  {item.field_type === 'text' ||
                  item.field_type === 'number' ? (
                    <>
                      <Label htmlFor={item.field_type}>{item.field_name}</Label>
                      <span className="text-red-400 ml-1">
                        {item.field_required && '*'}
                      </span>
                      <Input
                        className="dark:bg-[#4b4b4b]"
                        id={item.field_type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [item.field_name]: e.target.value,
                          })
                        }
                        key={item.id}
                        type={item.field_type}
                      />
                    </>
                  ) : item.field_type === 'data' ? (
                    /* Campo de data */
                    <div className="flex flex-col ">
                      <div>
                        <Label className="mb-3" htmlFor={item.field_type}>
                          {item.field_name}
                        </Label>
                        <span className="text-red-400 ml-1">
                          {item.field_required && '*'}
                        </span>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-[240px] pl-3 text-left font-normal dark:bg-[#4b4b4b] dark:text-white',
                              !formData.data && 'text-muted-foreground'
                            )}
                          >
                            {formData.data ? (
                              String(formData.data)
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 ]" align="start">
                          <Calendar
                            className="dark:bg-[#383838]"
                            locale={ptBR}
                            mode="single"
                            initialFocus
                            selected={formData.data as Date}
                            onSelect={handleDateSelect}
                          />
                        </PopoverContent>
                      </Popover>
                      <p className="font-semibold my-3 w-[242px] text-center">
                        {formData.data && avaliableSlots.length > 0
                          ? (formData.data as string)
                          : null}
                      </p>
                      {avaliableSlots.length > 0 ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {avaliableSlots.map((slot: Timeslot) => (
                            <Button
                              onClick={() => {
                                if (slot.available) {
                                  setFormData({
                                    ...formData,
                                    starttime: slot.starttime,
                                    endtime: slot.endtime,
                                  })
                                }
                              }}
                              key={slot._id}
                              variant="outline"
                              className={`hover:bg-primary hover:text-white ${
                                !slot.available &&
                                'text-gray-400 hover:text-gray-400 hover:bg-white cursor-default'
                              } ${
                                slot.starttime === formData.starttime &&
                                slot.endtime === formData.endtime &&
                                'bg-primary text-white'
                              }`}
                            >
                              {slot.starttime} - {slot.endtime}
                            </Button>
                          ))}
                        </div>
                      ) : formData.data && avaliableSlots.length === 0 ? (
                        <p className="">Nenhum horário disponível</p>
                      ) : null}
                    </div>
                  ) : item.field_type === 'multiple_choice' ? (
                    /* Campo de múltipla escolha (alterado para checkbox) */
                    <>
                      <Label>{item.field_name}</Label>
                      <span className="text-red-400 ml-1">
                        {item.field_required && '*'}
                      </span>
                      <div className="flex flex-col gap-2 mt-2">
                        {item.options?.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="flex items-center gap-2"
                          >
                            <input
                              className="dark:bg-[#fff]"
                              type="checkbox"
                              name={item.field_name}
                              value={option}
                              checked={
                                Array.isArray(formData[item.field_name]) &&
                                (
                                  formData[item.field_name] as string[]
                                ).includes(option)
                              }
                              onChange={() =>
                                handleMultipleChoiceChange(
                                  item.field_name,
                                  option
                                )
                              }
                            />
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : item.field_type === 'dropdown' ? (
                    <div>
                      <Label>{item.field_name}</Label>
                      <span className="text-red-400 ml-1">
                        {item.field_required && '*'}
                      </span>
                      <select
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [item.field_name]: e.target.value,
                          })
                        }
                        className="w-full p-2 mt-2 border border-gray-300 rounded-md dark:bg-[#4b4b4b]"
                      >
                        <option value="">Selecione uma opção</option>
                        {item.options?.map((option, optionIndex) => (
                          <option key={optionIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}
                </div>
              ))}
              <Button onClick={handleBooking}>Agendar</Button>
            </div>
          </>
        )}
      </div>
    </Container>
  )
}
