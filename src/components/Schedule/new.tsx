import { Container } from '@/components/container'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { useEffect, useState } from 'react'
import {
  IoAddOutline,
  IoCalendarOutline,
  IoChevronBack,
  IoTrashOutline,
} from 'react-icons/io5'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ptBR } from 'date-fns/locale'
import { useCreateSchedule } from '@/hooks/use-create-schedule'
import { useNavigate } from 'react-router-dom'
import { toast } from '../ui/use-toast'
import { motion, AnimatePresence } from 'framer-motion'

type TimeSlot = {
  starttime: string
  endtime: string
}

type Schedule = {
  date: string
  timeSlots: TimeSlot[]
}

export function NewSchedule() {
  const navigate = useNavigate()
  const { mutate: createSchedule, isPending: isLoading } = useCreateSchedule()
  const [schedules, setSchedules] = useState<Schedule[]>([])

  const addNewDay = () => {
    setSchedules([...schedules, { date: '', timeSlots: [] }])
  }

  useEffect(() => {
    if (isLoading) {
      toast({
        variant: 'default',
        title: 'Atualizando o agendamento',
        description: 'Aguarde um momento...',
      })
    }
  }, [isLoading])

  const addTimeSlot = (index: number) => {
    const updatedSchedules = schedules.map((schedule, i) =>
      i === index
        ? {
            ...schedule,
            timeSlots: [
              ...schedule.timeSlots,
              { starttime: '08:00', endtime: '09:00' },
            ],
          }
        : schedule
    )
    setSchedules(updatedSchedules)
  }

  const handleTimeChange = (
    dayIndex: number,
    timeIndex: number,
    field: keyof TimeSlot,
    value: string
  ) => {
    const updatedSchedules = schedules.map((schedule, i) =>
      i === dayIndex
        ? {
            ...schedule,
            timeSlots: schedule.timeSlots.map((slot, j) =>
              j === timeIndex ? { ...slot, [field]: value } : slot
            ),
          }
        : schedule
    )
    setSchedules(updatedSchedules)
  }

  const handleDateChange = (index: number, value: string) => {
    const [year, month, day] = value.split('-')
    const formattedDate = `${day}/${month}/${year}` // Formata para dd/MM/yyyy
    const updatedSchedules = schedules.map((schedule, i) =>
      i === index ? { ...schedule, date: formattedDate } : schedule
    )
    setSchedules(updatedSchedules)
  }

  const removeTimeSlot = (dayIndex: number, timeIndex: number) => {
    const updatedSchedules = schedules.map((schedule, i) =>
      i === dayIndex
        ? {
            ...schedule,
            timeSlots: schedule.timeSlots.filter((_, j) => j !== timeIndex),
          }
        : schedule
    )
    setSchedules(updatedSchedules)
  }

  const handleCreateSchedule = () => {
    createSchedule(schedules)
    setSchedules([])
  }

  const handleGoBack = () => {
    navigate('/horarios')
  }

  return (
    <Container className="p-6  flex flex-col items-center">
      <div className="w-[1000px]">
        <div className="flex  items-center  mb-5 gap-2">
          <div
            className="flex items-center gap-2 cursor-pointer "
            onClick={handleGoBack}
          >
            <IoChevronBack />
            <p>Voltar</p>
          </div>
        </div>{' '}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Configurar Horários
        </h1>
        <Button onClick={addNewDay} className="mb-5">
          <IoAddOutline className="mr-2 h-5 w-5" />
          Adicionar Novo Dia
        </Button>
        <div className="w-full space-y-6">
          {schedules.map((schedule, dayIndex) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              key={dayIndex}
              className="border rounded-lg p-4 bg-white shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="flex items-center bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 transition-all rounded-md">
                      {schedule.date || 'Escolha uma data'}
                      <IoCalendarOutline className="ml-2 text-gray-500" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      locale={ptBR}
                      mode="single"
                      selected={
                        schedule.date
                          ? new Date(schedule.date + 'T00:00')
                          : undefined
                      }
                      onSelect={(date) =>
                        handleDateChange(
                          dayIndex,
                          date?.toISOString().split('T')[0] || ''
                        )
                      }
                    />
                  </PopoverContent>
                </Popover>
                <Button onClick={() => addTimeSlot(dayIndex)} variant="outline">
                  <IoAddOutline className="mr-2" /> Adicionar horário
                </Button>
              </div>
              <div className="space-y-3">
                <AnimatePresence>
                  {schedule.timeSlots.map((slot, timeIndex) => (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.2 }}
                      key={timeIndex}
                      className="flex items-center justify-between space-x-4"
                    >
                      <div className="flex space-x-2">
                        <input
                          type="time"
                          value={slot.starttime}
                          onChange={(e) =>
                            handleTimeChange(
                              dayIndex,
                              timeIndex,
                              'starttime',
                              e.target.value
                            )
                          }
                          className="p-2 border rounded-md w-28"
                        />
                        <span>-</span>
                        <input
                          type="time"
                          value={slot.endtime}
                          onChange={(e) =>
                            handleTimeChange(
                              dayIndex,
                              timeIndex,
                              'endtime',
                              e.target.value
                            )
                          }
                          className="p-2 border rounded-md w-28"
                        />
                      </div>
                      <IoTrashOutline
                        className=" w-5 h-5 cursor-pointer"
                        onClick={() => removeTimeSlot(dayIndex, timeIndex)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
        {schedules.length > 0 && (
          <Button onClick={handleCreateSchedule} className="mt-5">
            Salvar Todos os Horários
          </Button>
        )}
      </div>
    </Container>
  )
}
