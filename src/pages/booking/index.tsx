import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Container } from '../../components/container'
import { Title } from '../../components/title'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  IoCalendarOutline,
  IoPencilOutline,
  IoTrashOutline,
} from 'react-icons/io5'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useGetBooking } from '../../hooks/use-get-booking'
import { useUpdateBooking } from '../../hooks/use-update-booking'
import { useDeleteBooking } from '../../hooks/use-delete-booking'
import { useGetSchedule } from '@/hooks/use-get-schedule'
import { useGetForm } from '@/hooks/use-get-form'
import { formateDate } from '../../utils/formate-date'
import { ptBR } from 'date-fns/locale'
import { Card } from '@/components/ui/card'
import { GoBack } from '@/components/ui/back-button'
import { useToast } from '@/components/ui/use-toast'
import { StatusBadge } from '@/components/ui/status-bedge'
import { BedgeSkeleton, BookingSkeleton } from '@/components/Booking/Skeleton'
import useAuthStore from '@/store/user-auth.store'

export function BookingDetails() {
  const { user } = useAuthStore()
  const { id } = useParams<{ id: string }>()
  const { data: booking, isLoading } = useGetBooking(id!)
  const { toast } = useToast()
  const formId = booking?.form?.id
  const { data: form } = useGetForm(formId || '')
  const { data: schedules } = useGetSchedule()
  const { mutate: updateBooking, isPending: isLoadingUpdateBooking } =
    useUpdateBooking()
  const { mutate: deleteBooking } = useDeleteBooking()

  // State management
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<{ [key: string]: any }>({})
  const [availableSchedules, setAvailableSchedules] = useState<string[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null)

  useEffect(() => {
    if (booking?.data) {
      setFormData(formatBookingData(booking.data))
    }
  }, [booking])

  useEffect(() => {
    if (formData.data && schedules) {
      const selectedDate = formData.data
      const filteredSchedules = schedules
        .filter((schedule: { date: string }) => schedule.date === selectedDate)
        .flatMap((schedule: { timeslots: any[] }) =>
          schedule.timeslots.filter((slot) => slot.available)
        )
        .map(
          (slot: { starttime: any; endtime: any }) =>
            `${slot.starttime} - ${slot.endtime}`
        )

      setAvailableSchedules(filteredSchedules || [])
    } else {
      setAvailableSchedules([])
    }
  }, [formData.data, schedules])

  useEffect(() => {
    if (isLoadingUpdateBooking) {
      toast({
        variant: 'default',
        title: 'Atualizando o agendamento',
        description: 'Aguarde um momento...',
      })
    }
  }, [isLoadingUpdateBooking])

  const formatBookingData = (data: any) => {
    return Object.keys(data).reduce((acc: { [key: string]: any }, key) => {
      acc[key.toLowerCase()] = data[key]
      return acc
    }, {})
  }

  const handleEdit = () => setIsEditing(true)
  const handleCancel = () => {
    setIsEditing(false)
    setFormData(formatBookingData(booking?.data)) // Reset form data
  }

  const handleChange = (key: string, value: string | Date | string[]) => {
    const normalizedKey = key.toLowerCase()
    setFormData((prev) => ({
      ...prev,
      [normalizedKey]: value,
    }))
  }

  const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    const restrictedStatuses = ['aprovado', 'cancelado', 'concluido']

    if (restrictedStatuses.includes(booking?.status)) {
      toast({
        variant: 'destructive',
        title: 'Erro!',
        description: `Não é possível editar um agendamento ${booking?.status}.`,
      })
      return
    }

    if (id) {
      updateBooking({ bookingId: id, data: formData })
      setIsEditing(false)
    }
  }

  const renderInputField = (field: any) => {
    const { field_name, field_type, options, id, field_required } = field
    const normalizedFieldName = field_name.toLowerCase()
    const value = formData[normalizedFieldName] || []

    switch (field_type) {
      case 'text':
      case 'number':
        return (
          <div key={id} className="mb-4">
            <label className="block mb-2 font-medium">
              {field_name}{' '}
              {field_required && <span className="text-red-500">*</span>}
            </label>
            <Input
              className="dark:bg-[#383838] dark:text-white"
              type={field_type}
              value={value}
              onChange={(e) => handleChange(field_name, e.target.value)}
              disabled={!isEditing}
            />
          </div>
        )
      case 'multiple_choice':
        return (
          <div key={id} className="mb-4">
            <label className="block mb-2 font-medium">
              {field_name}{' '}
              {field_required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex flex-col gap-2">
              {options.map((option: string, index: number) => (
                <label key={index} className="flex items-center gap-2">
                  <input
                    className="dark:bg-[#383838]"
                    type="checkbox"
                    name={normalizedFieldName}
                    value={option}
                    checked={value.includes(option)}
                    onChange={() => {
                      const newSelectedOptions = [...value]
                      if (newSelectedOptions.includes(option)) {
                        newSelectedOptions.splice(
                          newSelectedOptions.indexOf(option),
                          1
                        )
                      } else {
                        newSelectedOptions.push(option)
                      }
                      handleChange(normalizedFieldName, newSelectedOptions)
                    }}
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
          <div key={id} className="mb-4">
            <label className="block mb-2 font-medium">
              {field_name}{' '}
              {field_required && <span className="text-red-500">*</span>}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="flex items-center bg-gray-100 px-4 py-2 dark:bg-[#383838] dark:text-white text-gray-700 hover:bg-gray-200 transition-all rounded-md">
                  {value ? value : 'Escolha uma data'}
                  <IoCalendarOutline className="ml-2 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  locale={ptBR}
                  mode="single"
                  selected={value ? value : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const formattedDate = formateDate(date.toString())
                      handleChange(normalizedFieldName, formattedDate)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        )
      case 'dropdown':
        return (
          <div key={id} className="mb-4">
            <label className="block mb-2 font-medium">
              {field_name}{' '}
              {field_required && <span className="text-red-500">*</span>}
            </label>
            <div className="flex flex-col gap-2">
              <select
                value={Array.isArray(value) ? value[0] : value}
                onChange={(e) =>
                  handleChange(normalizedFieldName, e.target.value)
                }
                disabled={!isEditing}
                className="border border-gray-300 rounded-md p-2 dark:bg-[#383838]"
              >
                <option value="" disabled>
                  Selecione uma opção
                </option>
                {options.map((option: string, index: number) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <Container className="p-10 flex flex-col items-center">
      <div className="w-full max-w-[900px] px-5">
        <div className="mb-10">
          <div className="flex justify-between">
            <GoBack />
            {user?.role !== 'COORDINATOR' && (
              <div className="flex gap-5">
                <Card className="p-3 cursor-pointer" onClick={handleEdit}>
                  <IoPencilOutline className="h-5 w-5" />
                </Card>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Card className="p-3 cursor-pointer">
                      <IoTrashOutline className="h-5 w-5" />
                    </Card>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir agendamento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Deseja excluir
                        permanentemente este agendamento?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => id && deleteBooking(id)}
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
          <Title>
            <p className="mt-5">Detalhes do Agendamento</p>
          </Title>
        </div>
        {isLoading ? (
          <BedgeSkeleton />
        ) : (
          <StatusBadge status={booking?.status} />
        )}
        {isLoading ? (
          <BookingSkeleton />
        ) : (
          <form className="flex flex-col gap-4 mt-5">
            {form?.form_fields.map(renderInputField)}
            {isEditing && (
              <div>
                <label className="block mb-2 font-medium">
                  Horários Disponíveis
                </label>
                {availableSchedules.length > 0 ? (
                  <ul>
                    {availableSchedules.map((schedule, index) => (
                      <li key={index} className="mb-2">
                        <Button
                          type="button"
                          variant="outline"
                          className={`hover:text-white ${
                            selectedSchedule === schedule
                              ? 'bg-primary text-white border-primary hover:bg-primary/90'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-primary '
                          }`}
                          onClick={() => {
                            const [starttime, endtime] = schedule.split(' - ')
                            setSelectedSchedule(schedule)
                            handleChange('starttime', starttime)
                            handleChange('endtime', endtime)
                          }}
                        >
                          {schedule}
                        </Button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">
                    Não há horários disponíveis para a data selecionada.
                  </p>
                )}
              </div>
            )}
          </form>
        )}
        <p className="w-fit bg-accent text-gray-600 font-medium px-4 py-2 rounded dark:bg-[#383838] dark:text-white">
          {booking?.data?.starttime}- {booking?.data?.endtime}
        </p>
        <div className="bg-accent px-4 py-2 rounded mt-4 dark:bg-[#383838] dark:text-white">
          <h4 className="font-medium text-gray-600 dark:text-gray-400">
            Observações
          </h4>
          <p className="mt-2 dark:text-white">{booking?.observation}</p>
        </div>
        {isEditing && (
          <div className="flex justify-end mt-5">
            <Button className="ml-4" onClick={(e) => handleSave(e)}>
              Salvar
            </Button>
            <Button
              variant="secondary"
              onClick={handleCancel}
              className="bg-destructive hover:bg-destructive/90 ml-3 text-white"
            >
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </Container>
  )
}
