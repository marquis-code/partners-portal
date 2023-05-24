import moment from 'moment';

export const formatTime = (time:any) => {
  return moment(time).format('LT');
}

export const formatDate = (date:Date) => {
  return moment(date).format('DD-MM-YYYY');
}

export const formatApiCallDate = (date:Date) => {
  return moment(date).format('YYYY-MM-DD');
}

export const Capitalize = (str:string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const dateStringToDateObject = (date:string) => {
  return moment(date, 'DD-MM-YYYY').toDate();
}

export function downloadFile (url:string, fileName:string) {
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const formatNaira = (amount:number) => {
  return amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
}
