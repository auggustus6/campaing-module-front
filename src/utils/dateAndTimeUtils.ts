import moment from 'moment';

export function getNowOnlyDate() {
  const newDate = new Date(moment.utc().format('YYYY-MM-DD'));
  return newDate;
}

export function getMinutesFromTime(time: string) {
  const [hours, minutes] = time.split(':');
  return Number(hours) * 60 + Number(minutes) || 0;
}

export function getTimeFromMinutes(time: number) {
  return Math.floor(time / 60) + ':' + ('0' + (time % 60)).slice(-2);
}

export function formatDateTime(date?: string) {
  return moment.utc(date).format('YYYY-MM-DDTHH:mm');
}

export function formatDate(date?: string) {
  return moment.utc(date).format('YYYY-MM-DD');
}

export function tableFormatDate(date?: string) {
  if (date) return moment.utc(date).format('DD/MM/YYYY');
  else return '- - - - - - - - - - - - - -';
}

export function tableFormatDateTime(date?: string) {
  if (date) return moment.utc(date).format('DD/MM/YYYY - HH:mm');
  else return '- - - - - - - - - - - - - -';
}
