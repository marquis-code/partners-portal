import {Ref, ref, computed} from 'vue'
import { useStore } from 'vuex';
import {axiosInstance as axios} from '@/plugins/axios';
import html2canvas from 'html2canvas';
import {jsPDF as JsPDF} from 'jspdf';
import {useToast} from 'vue-toast-notification';
import { extractErrorMessage } from '@/utils/helper';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'

interface pdfType {name:string;pdf:JsPDF;pages:number}
interface slipType {revenues: any[]; totalRevenue: number; netRevenue: number; totalDeduction: number}

interface paymentBreakDown {netRevenue:number;totalRevenue: number; totalDeduction:number; referenceTime:string;}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const loading = ref(false)
const downloading = ref(false)
const slips = ref([]) as Ref<slipType[]>
const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth() + 1)

const totalPayslipData = {
  netRevenue: ref(0),
  totalRevenue: ref(0),
  totalDeductions: ref(0),
  paymentBreakdown: ref([]) as Ref<paymentBreakDown[]>,
  revenues: ref([]) as Ref<any[]>
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
const generatedYear = ref(null) as Ref<number|null>

const clearPaySlip = () => {
  totalPayslipData.netRevenue.value = 0
  totalPayslipData.totalDeductions.value = 0
  totalPayslipData.totalRevenue.value = 0
  totalPayslipData.paymentBreakdown.value = []
  totalPayslipData.revenues.value = []
}

// const convertPxToPt = (num:number) => {
//   if (num < 400) return num * 0.75
//   return (num * 0.75) - 100
// }

const printPayslip = async () => {
  payslipData.value = [...totalPayslipData.revenues.value]
  downloading.value = true
  firstPageData.value = []; otherPagesData.value = []
  num_of_other_pages.value = 0
  const pdf = new JsPDF('p', 'pt', 'a4');
  if (payslipData.value.length <= first_page_row.value) {
    // console.log('first gen metod')
    firstPageData.value = payslipData.value
    await new Promise(resolve => setTimeout(resolve, 1000));
    const el:HTMLElement = document.querySelector('#payslip-pdf-content')!
    html2canvas(el).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
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
    const first_canvas = await html2canvas(el)
    canvasList.value.push(first_canvas)
    for (let i = 0; i < payslipData.value.length; i += rowPerPage.value) {
      num_of_other_pages.value++
      const subArray = payslipData.value.slice(i, i + rowPerPage.value);
      otherPagesData.value = subArray
      await new Promise(resolve => setTimeout(resolve, 100)); // wait so the template is filled with data
      const el:HTMLElement = document.querySelector('#pdf-other-pages')!
      const other_canvas = await html2canvas(el)
      canvasList.value.push(other_canvas)
    }
    for (const [index, canvas] of canvasList.value.entries()) {
      const imageData = canvas.toDataURL('image/png');
      if (index > 0) pdf.addPage()
      pdf.addImage(imageData, 'PNG', 40, 40, 500, 700);
    }
    downloading.value = false
    pdf.save(`${generatedFileName.value}.pdf`)
  }
  // downloading.value = false
  // pdf.save(`${generatedFileName.value}.pdf`)
}

const combineRevenues = (data:any[]) => {
  for (const x of data) {
    totalPayslipData.netRevenue.value = totalPayslipData.netRevenue.value + x?.netRevenue
    totalPayslipData.totalRevenue.value = totalPayslipData.totalRevenue.value + x?.totalRevenue
    totalPayslipData.totalDeductions.value = totalPayslipData.totalDeductions.value + x?.totalDeduction
    totalPayslipData.revenues.value = x?.revenues?.length ? totalPayslipData.revenues.value.concat(x?.revenues) : totalPayslipData.revenues.value
  }
}

export const usePayslip = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const fetchPayslip = async () => {
    clearPaySlip()
    try {
      loading.value = true
      generatedMonth.value = months[Number(selectedMonth.value) - 1]
      generatedYear.value = selectedYear.value
      generatedFileName.value = `${months[Number(selectedMonth.value) - 1]}-${selectedYear.value} Pay slip`
      const res = await axios.get(
        `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/payslips/${selectedYear.value}/${selectedMonth.value}?page=1&perPage=10`
      );
      // console.log(res.data)
      if (res?.data?.length) {
        totalPayslipData.paymentBreakdown.value = res.data
        combineRevenues(res.data)
      } else {
        payslipData.value = []
        Swal.fire({ title: 'Error!', text: 'No payslip for the selected period', icon: 'error', confirmButtonColor: "#000000"})
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

  return { loading, selectedMonth, selectedYear, previewPdf, fetchPayslip, payslipData, firstPageData, otherPagesData, months, num_of_other_pages, rowPerPage, first_page_row, ...totalPayslipData, downloading, printPayslip, clearPaySlip, generatedMonth, generatedYear }
}
