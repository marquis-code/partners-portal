import moment from 'moment';

export function getExpiryDate (date: string): string | null {
  if (moment(date).isValid()) {
    return moment(date).format('LL');
  } else {
    return null
  }
}

export function getUserReadableDate (date: string): string {
  return moment(date).format('LL');
}

export function getDefaultDatePickerDate (date: string): string {
  return moment(date).format('YYYY-MM-DD');
}
