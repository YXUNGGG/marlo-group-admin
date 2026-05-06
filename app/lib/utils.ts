import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatTime = (date: Date): string => {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  if (date > today) return `Сегодня, ${date.toLocaleTimeString().slice(0, 5)}`;

  const yesterday = new Date(today.setDate(today.getDate() - 1));
  if (date > yesterday) return "Вчера";

  const daysLater = Math.ceil(Math.abs(new Date().getTime() - date.getTime()) / (1000 * 3600 * 24));

  if (daysLater < 5) return `${daysLater} дня назад`;
  else return new Intl.DateTimeFormat("ru-RU").format(date);

  // let dayEnding;
  // switch (daysLater % 10) {
  //   case 1:
  //     dayEnding = "день";
  //     break;
  //   case 2:
  //   case 3:
  //   case 4:
  //     dayEnding = "дня";
  //     break;
  //   default:
  //     dayEnding = "дней";
  // }

  // return `${daysLater} ${dayEnding} назад`;
};
