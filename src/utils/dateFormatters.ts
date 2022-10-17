import moment from 'moment';

export function getExpiryDate(date: string): string {
  if (moment(date).isValid()) {
    return moment(date).format('LL');
  } else {
    return 'Does not expire'
  }
}

export function getUserReadableDate(date: string): string {
  return moment(date).format('LL');
}
