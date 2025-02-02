import React from 'react'
import { Button } from '@/components/ui/button'

type AvailableSchedulesProps = {
  availableSchedules: string[]
  selectedSchedule: string | null
  onScheduleSelect: (schedule: string) => void
}

const AvailableSchedules: React.FC<AvailableSchedulesProps> = ({
  availableSchedules,
  selectedSchedule,
  onScheduleSelect,
}) => {
  return (
    <div>
      <label className="block mb-2 font-medium">Horários Disponíveis</label>
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
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-primary'
                }`}
                onClick={() => onScheduleSelect(schedule)}
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
  )
}

export default AvailableSchedules
