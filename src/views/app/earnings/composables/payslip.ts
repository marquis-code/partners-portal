import {Ref, ref, computed} from 'vue'
import { useStore } from 'vuex';
import {axiosInstance as axios} from '@/plugins/axios';
import html2canvas from 'html2canvas';
import {jsPDF as JsPDF} from 'jspdf';
import {useToast} from 'vue-toast-notification';
import { extractErrorMessage } from '@/utils/helper';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import moment from 'moment'
import {compress, compressAccurately} from 'image-conversion';

// interface pdfType {name:string;pdf:JsPDF;pages:number}
// interface slipType {revenues: any[]; totalRevenue: number; netRevenue: number; totalDeduction: number}
interface metadataType {currentPage:number;pages:number;perPage:number;total:number}
interface paymentBreakDown {netRevenue:number;totalRevenue: number; totalDeductions:number; referenceTime:string;}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const loading = ref(false)
const downloading = ref(false)
const fetching_revenues = ref(false)
// const slips = ref([]) as Ref<slipType[]>
// const selectedYear = ref(new Date().getFullYear())
// const selectedMonth = ref(new Date().getMonth() + 1)
const earnings = ref([]) as Ref<any[]>
const selectedEarnings = ref() as Ref<any>
const earningPage = ref(1)
const earningMetadata = ref({}) as Ref<metadataType>

const totalPayslipData = {
  netRevenue: ref(0),
  totalRevenue: ref(0),
  totalDeductions: ref(0),
  paymentBreakdown: ref([]) as Ref<paymentBreakDown[]>,
  revenues: ref([]) as Ref<any[]>,
  revenuePage: ref(1),
  revenueMetadata: ref({}) as Ref<metadataType>
}

const previewPdf = ref(null) as Ref<any>
const payslipData = ref([]) as Ref<any[]>
const firstPageData = ref([]) as Ref<any[]>
const otherPagesData = ref([]) as Ref<any[]>
const num_of_other_pages = ref(0)
// const first_page_row = ref(7)
const first_page_row = computed(() => {
  return 7 - (Math.ceil(totalPayslipData.paymentBreakdown.value.length / 2))
})
const rowPerPage = ref(12)
const generatedFileName = ref('')
const generatedMonth = ref('')
const generatedYear = ref('')

const html2canvasOptions = {
  scale: 2, // Reduce image quality by setting a lower scale value
  dpi: 72, // Adjust the DPI as needed
  useCORS: true, // Enable CORS to allow JPEG conversion
};
const imageKbSize = 200

const clearPaySlip = () => {
  totalPayslipData.netRevenue.value = 0
  totalPayslipData.totalDeductions.value = 0
  totalPayslipData.totalRevenue.value = 0
  totalPayslipData.paymentBreakdown.value = []
  totalPayslipData.revenues.value = []
  selectedEarnings.value = null
}

function dataURLtoBlob (dataURL:string) {
  const parts = dataURL.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);

  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
}

function blobToDataURL (blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function () {
      resolve(reader.result);
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(blob);
  });
}

export const usePayslip = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const printPayslip = async () => {
    downloading.value = true
    const earningIds = ref([]) as Ref<any[]>
    for (const x of selectedEarnings.value?.earnings) {
      earningIds.value.push(x.earningId)
    }

    try {
      const res = await axios.get(
        `/cost-revenue/v1/revenues?page=1&perPage=10&earningIds=${earningIds.value.join(',')}&partnerId=${partnerContext.value.partner.account_sid}`
      );
      const data = res?.data
      if (data.result.length) {
        const total = data.metadata.total
        const resp = await axios.get(
          `/cost-revenue/v1/revenues?page=1&perPage=${total}&earningIds=${earningIds.value.join(',')}&partnerId=${partnerContext.value.partner.account_sid}`
        );
        if (resp.data.result.length) {
          payslipData.value = resp.data.result
          generatedFileName.value = generatedMonth.value + '-' + generatedYear.value + '-payslip'
        }
      } else {
        Swal.fire({ title: 'Error!', text: data?.message || 'Unable to fetch revenues', icon: 'error', confirmButtonColor: "#000000"})
        downloading.value = false
        return;
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, 'Oops! An error occurred, please try again.');
      Swal.fire({ title: 'Error!', text: errorMessage || 'An error occured', icon: 'error', confirmButtonColor: "#000000"})
      downloading.value = false
      return;
    }

    // begin pdf generation
    firstPageData.value = []; otherPagesData.value = []
    num_of_other_pages.value = 0
    const pdf = new JsPDF('p', 'pt', 'a4');
    if (payslipData.value.length <= first_page_row.value) {
      firstPageData.value = payslipData.value
      await new Promise(resolve => setTimeout(resolve, 1000));
      const el:HTMLElement = document.querySelector('#payslip-pdf-content')!
      html2canvas(el, html2canvasOptions).then(async (canvas) => {
        let imageData:any = canvas.toDataURL('image/png');
        imageData = await compressAccurately(dataURLtoBlob(imageData), imageKbSize);
        imageData = await blobToDataURL(imageData)
        // pdf.addImage(imageData, 'PNG', 40, 40, 500, convertPxToPt(canvas.height));
        pdf.addImage(imageData, 'PNG', 40, 40, 500, 700);
        downloading.value = false
        pdf.save(`${generatedFileName.value}.pdf`)
      })
    } else {
      const canvasList = ref([]) as Ref<any[]>

      // handle first page
      firstPageData.value = payslipData.value.splice(0, first_page_row.value)
      await new Promise(resolve => setTimeout(resolve, 100)); // wait so the template is filled with data
      const el:HTMLElement = document.querySelector('#payslip-pdf-content')!
      const first_canvas = await html2canvas(el, html2canvasOptions)
      canvasList.value.push(first_canvas)
      for (let i = 0; i < payslipData.value.length; i += rowPerPage.value) {
        num_of_other_pages.value++
        const subArray = payslipData.value.slice(i, i + rowPerPage.value);
        otherPagesData.value = subArray
        await new Promise(resolve => setTimeout(resolve, 100)); // wait so the template is filled with data
        const el:HTMLElement = document.querySelector('#pdf-other-pages')!
        const other_canvas = await html2canvas(el, html2canvasOptions)
        canvasList.value.push(other_canvas)
      }
      for (const [index, canvas] of canvasList.value.entries()) {
        let imageData = canvas.toDataURL('image/png');
        imageData = await compressAccurately(dataURLtoBlob(imageData), imageKbSize);
        imageData = await blobToDataURL(imageData)
        if (index > 0) pdf.addPage()
        pdf.addImage(imageData, 'PNG', 40, 40, 500, 700);
      }
      downloading.value = false
      pdf.save(`${generatedFileName.value}.pdf`)
    }
  }

  const fetchEarnings = async () => {
    try {
      loading.value = true
      const res = await axios.get(
        `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/payslips?page=${earningPage.value}&perPage=10`
      );
      const data = res?.data
      if (data?.result.length) {
        earnings.value = data.result
        earningMetadata.value = data.metadata
      } else {
        earnings.value = []
        Swal.fire({ title: 'Error!', text: data?.message || 'No payslip available', icon: 'error', confirmButtonColor: "#000000"})
      }
      loading.value = false
    } catch (error:any) {
      const errorMessage = extractErrorMessage(
        error,
        null,
        'Oops! An error occurred, please try again.'
      );
      Swal.fire({ title: 'Error!', text: errorMessage || 'An error occured', icon: 'error', confirmButtonColor: "#000000"})
      loading.value = false
    }
  }

  const fetchData = async (earning:any) => {
    clearPaySlip()
    fetching_revenues.value = true
    selectedEarnings.value = earning
    generatedMonth.value = moment(earning.referenceTime).format('MMMM')
    generatedYear.value = moment(earning.referenceTime).format('YYYY')
    totalPayslipData.paymentBreakdown.value = earning.earnings

    const earningIds = ref([]) as Ref<any[]>
    for (const x of earning?.earnings) {
      earningIds.value.push(x.earningId)
    }
    try {
      const res = await axios.get(
        `/cost-revenue/v1/revenues?page=${totalPayslipData.revenuePage.value}&perPage=10&earningIds=${earningIds.value.join(',')}&partnerId=${partnerContext.value.partner.account_sid}`
      );
      const data = res?.data
      if (data.result.length) {
        totalPayslipData.netRevenue.value = data.metadata.revenue.netRevenue
        totalPayslipData.totalRevenue.value = data.metadata.revenue.totalRevenue
        totalPayslipData.totalDeductions.value = data.metadata.revenue.totalDeductions
        totalPayslipData.revenues.value = data.result
        totalPayslipData.revenueMetadata.value = data.metadata
      } else {
        Swal.fire({ title: 'Error!', text: data?.message || 'Unable to fetch revenues', icon: 'error', confirmButtonColor: "#000000"})
        totalPayslipData.revenues.value = []
      }
      fetching_revenues.value = false
    } catch (error) {
      const errorMessage = extractErrorMessage(error, null, 'Oops! An error occurred, please try again.');
      Swal.fire({ title: 'Error!', text: errorMessage || 'An error occured', icon: 'error', confirmButtonColor: "#000000"})
      fetching_revenues.value = false
    }
  }
  return { loading, fetching_revenues, previewPdf, fetchEarnings, fetchData, earnings, selectedEarnings, earningMetadata, earningPage, payslipData, firstPageData, otherPagesData, months, num_of_other_pages, rowPerPage, first_page_row, ...totalPayslipData, downloading, printPayslip, clearPaySlip, generatedMonth, generatedYear }
}

// const combineRevenues = (data:any[]) => {
//   for (const x of data) {
//     totalPayslipData.netRevenue.value = totalPayslipData.netRevenue.value + x?.netRevenue
//     totalPayslipData.totalRevenue.value = totalPayslipData.totalRevenue.value + x?.totalRevenue
//     totalPayslipData.totalDeductions.value = totalPayslipData.totalDeductions.value + x?.totalDeduction
//     totalPayslipData.revenues.value = x?.revenues?.length ? totalPayslipData.revenues.value.concat(x?.revenues) : totalPayslipData.revenues.value
//   }
// }

// const convertPxToPt = (num:number) => {
//   if (num < 400) return num * 0.75
//   return (num * 0.75) - 100
// }

// const fetchPayslip = async () => {
//   clearPaySlip()
//   try {
//     loading.value = true
//     generatedMonth.value = months[Number(selectedMonth.value) - 1]
//     generatedYear.value = selectedYear.value
//     generatedFileName.value = `${months[Number(selectedMonth.value) - 1]}-${selectedYear.value} Pay slip`
//     const res = await axios.get(
//       `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/payslips/${selectedYear.value}/${selectedMonth.value}?page=1&perPage=10`
//     );
//     if (res?.data?.length) {
//       totalPayslipData.paymentBreakdown.value = res.data
//       combineRevenues(res.data)
//     } else {
//       payslipData.value = []
//       Swal.fire({ title: 'Error!', text: 'No payslip for the selected period', icon: 'error', confirmButtonColor: "#000000"})
//     }
//     loading.value = false
//   } catch (error:any) {
//     const errorMessage = extractErrorMessage(
//       error,
//       null,
//       'Oops! An error occurred, please try again.'
//     );
//     Swal.fire({ title: 'Error!', text: errorMessage || 'An error occured', icon: 'error', confirmButtonColor: "#000000"})
//     loading.value = false
//   }
// }
