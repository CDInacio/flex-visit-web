import { differenceInHours, differenceInMinutes, format } from "date-fns";
import { ptBR } from 'date-fns/locale';

export const formateDate = (date: string | undefined, format?: string) => {
  const newDate = new Date(date!);
  const day = String(newDate.getDate()).padStart(2, '0'); 
  const month = String(newDate.getMonth() + 1).padStart(2, '0'); 
  const year = newDate.getFullYear();
  const hours = String(newDate.getHours()).padStart(2, '0'); 
  const minutes = String(newDate.getMinutes()).padStart(2, '0');

  if (format === 'dd/mm/yyyy hh:mm') {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return `${day}/${month}/${year}`;
};

export const formatRelativeDate = (inputDate: Date): string => {
  const now = new Date();
  const minutesDiff = differenceInMinutes(now, inputDate);
  const hoursDiff = differenceInHours(now, inputDate);

  if (minutesDiff < 1) {
    return "agora";
  }

  if (minutesDiff < 60) {
    return `${minutesDiff} minutos atrás`;
  }

  if (hoursDiff < 2) {
    return "1 hora atrás";
  }

  if (hoursDiff < 24) {
    return `${hoursDiff} horas atrás`;
  }

  if (hoursDiff < 48) {
    return "ontem";
  }

  return format(inputDate, "dd/MM/yyyy 'às' HH:mm");
};

export const getDayOfWeekAndNumber = (dateString: string) => {
  const date = new Date(dateString);
  const daysOfWeek = ['dom', 'seg', 'ter', 'qua', 'quin', 'sex', 'sab'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dayOfMonth = String(date.getDate()).padStart(2, '0'); 
  const formattedDate = {
    day: dayOfWeek?.charAt(0).toUpperCase() + dayOfWeek?.slice(1),
    number: dayOfMonth
  };

  return formattedDate;
};

export const formatDateToCustomString = (dateString: string): string => {
  const dayOfWeek = format(dateString, "EEEE", { locale: ptBR }).slice(0, 3); 
  const capitalizedDayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1); 
  const dayOfMonth = format(dateString, "dd", { locale: ptBR });
  const month = format(dateString, "MMMM", { locale: ptBR });

  return `${capitalizedDayOfWeek} ${dayOfMonth} ${month}`;
};