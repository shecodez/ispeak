import { formatDistance, formatRelative, subDays } from 'date-fns';
import { ja } from 'date-fns/locale';

export function rand(min = 0, max = 999) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function formatDateDistance(date: string | null, locale: string, mock = false) {
  if (!date) return; // 'date unknown'

  if (mock) date = subDays(new Date(), rand(0, 5)).toString();
  const today = new Date();
  switch (locale) {
    case 'ja':
      return formatDistance(new Date(date), today, { addSuffix: true, locale: ja });
    default:
      return formatDistance(new Date(date), today, { addSuffix: true });
  }
}

export function formatDateRelative(date: string | null, locale: string, mock = false) {
  if (!date) return;

  if (mock) date = subDays(new Date(), rand(0, 5)).toString();
  const today = new Date();
  switch (locale) {
    case 'ja':
      return formatRelative(new Date(date), today, { locale: ja });
    default:
      return formatRelative(new Date(date), today);
  }
}

export function abbr(text: string, max = 3) {
  return text
    .split(/\s/)
    .reduce((res: string, word: string) => (res += word.slice(0, 1)), '')
    .substring(0, max);
}
