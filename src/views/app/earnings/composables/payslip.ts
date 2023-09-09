import {Ref, ref, computed} from 'vue'
import { useStore } from 'vuex';
import {axiosInstance as axios} from '@/plugins/axios';
import html2canvas from 'html2canvas';
import {jsPDF as JsPDF} from 'jspdf';
import {useToast} from 'vue-toast-notification';
import { extractErrorMessage } from '@/utils/helper';

interface pdfType {name:string;pdf:JsPDF;pages:number}

const toast = useToast()
const year = ['2023', '2022', '2021']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const loading = ref(false)
const selectedYear = ref('')
const selectedMonth = ref('')
const previewPdf = ref(null) as Ref<any>
const payslipData = ref([]) as Ref<any[]>
const netRevenue = ref(0)
const totalRevenue = ref(0)
const totalDeductions = ref(0)
const firstPageData = ref([]) as Ref<any[]>
const otherPagesData = ref([]) as Ref<any[]>
const num_of_other_pages = ref(0)
const rowPerPage = ref(10)
const generatedPdfs = ref([]) as Ref<pdfType[]>
const activePdf = ref() as Ref<pdfType|null>
const generatedFileName = ref('')

const convertPxToPt = (num:number) => {
  if (num < 400) return num * 0.75
  return (num * 0.75) - 100
}

const generatePreview = async () => {
  firstPageData.value = []; otherPagesData.value = []
  num_of_other_pages.value = 0
  const pdf = new JsPDF('p', 'pt', 'a4');
  if(payslipData.value.length <= 5) {
    firstPageData.value = payslipData.value
    await new Promise(resolve => setTimeout(resolve, 1000));
    const el:HTMLElement = document.querySelector('#payslip-pdf-content')!
    html2canvas(el).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
      pdf.addImage(imageData, 'PNG', 40, 40, 500, convertPxToPt(canvas.height));
    })
  } else {
    const canvasList = ref([]) as Ref<any[]>

    // handle first page
    firstPageData.value = payslipData.value.splice(0, 5)
    await new Promise(resolve => setTimeout(resolve, 100)); // wait so the template is filled with data
    const el:HTMLElement = document.querySelector('#payslip-pdf-content')!
    const first_canvas = await html2canvas(el)
    canvasList.value.push(first_canvas)
    for (let i = 0; i < payslipData.value.length; i += rowPerPage.value) {
      // console.log('go 3 times')
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
      pdf.addImage(imageData, 'PNG', 40, 40, 500, convertPxToPt(canvas.height));
    }
  }
  generatedPdfs.value.push({name: generatedFileName.value, pdf: pdf, pages: num_of_other_pages.value + 1})
  loading.value = false
}

export const usePayslip = () => {
  const store = useStore()
  const partnerContext:any = computed(() => store.getters['auth/activeContext'])

  const fetchPayslip = async () => {
    try {
      loading.value = true
      generatedFileName.value = `${months[Number(selectedMonth.value) - 1]}-${selectedYear.value} Pay slip`
      const res = await axios.get(
        `/cost-revenue/v1/partners/${partnerContext.value.partner.account_sid}/payslips/${selectedYear.value}/${selectedMonth.value}?page=1&perPage=10`
      );
      console.log(res)
      if (res.data.revenues.length) {
        payslipData.value = res.data.revenues
        netRevenue.value = res.data.netRevenue
        totalDeductions.value = res.data.totalDeduction
        totalRevenue.value = res.data.totalRevenue
        generatePreview()
      } else {
        payslipData.value = []
        toast.error('No payslip for the selected period')
      }
    } catch (error:any) {
      const errorMessage = extractErrorMessage(
        error,
        null,
        'Oops! An error occurred, please try again.'
      );
      toast.error(errorMessage);
      loading.value = false
    }
  }

  const onPreviewPdf = (data:pdfType) => {
    activePdf.value = data
    previewPdf.value = null
    previewPdf.value = data.pdf.output('datauristring')
  }

  const saveFile = () => {
    activePdf.value?.pdf.save(`${activePdf.value.name}.pdf`)
  }

  return { loading, selectedMonth, selectedYear, previewPdf, fetchPayslip, payslipData, firstPageData, otherPagesData, year, months, generatedPdfs, onPreviewPdf, activePdf, saveFile, num_of_other_pages, netRevenue, totalDeductions, totalRevenue, rowPerPage }
}

// sample data

// const payslipData = ref([
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
//   {
//     totalDeductedAmount: 0,
//     totalRefundedAmount: 0,
//     finalPartnersRevenue: 25000,
//     id: "59ea8a04-3442-425a-9b1f-d566cbf01903",
//     tripId: 59072,
//     partnerId: "53d73290-2709-42a3-837b-66aeeeacb86b",
//     vehicleId: 477,
//     routeId: 927,
//     driverId: 1277,
//     passengersCount: 1,
//     vehicleType: "Mini Bus",
//     partnersRevenue: 25000,
//     accruedEarningsId: "098ad0ce-7bd2-4317-a1c0-9ecf40419cd7",
//     isSettled: false,
//     shuttlersRevenue: 1250,
//     metadata: {
//       actor: {
//         id: 68,
//         email: "grace.obasi@shuttlers.ng",
//         fname: "grace",
//         lname: "obasi",
//         phone: "08035195139",
//         userType: "staff"
//       },
//       driver: {
//         email: "testdriverusman@mailinator.com",
//         fname: "Test Driver",
//         lname: "Usman"
//       },
//       pickup: "Ago Roundabout, Okota Road, Lagos, Nigeria",
//       dropoff: "Lekki Phase 1, Lagos, Nigeria",
//       endTime: null,
//       partner: {
//         id: 200,
//         mode: "individual",
//         email: null,
//         phone: null,
//         status: "active",
//         city_id: null,
//         rc_number: null,
//         rc_status: "submitted",
//         created_at: "2023-08-03 19:55:47",
//         updated_at: "2023-08-03 19:55:47",
//         account_sid: "53d73290-2709-42a3-837b-66aeeeacb86b",
//         company_name: "Janet Manji",
//         company_email: "janet@mailinator.com",
//         company_phone: "07035373336",
//         company_address: null,
//         years_of_experience: null
//       },
//       vehicle: {
//         name: "Coaster",
//         brand: "Toyota",
//         seats: 24,
//         registration_number: "JJK-012GS"
//       },
//       driverId: 1277,
//       routeCode: "AGO225",
//       startTime: "2023-09-01 07:00:11",
//       vehicleId: 477
//     },
//     tripStartTime: "2023-09-01T07:00:11.000Z",
//     createdAt: "2023-09-01T06:00:11.467Z",
//     updatedAt: "2023-09-01T06:00:11.467Z",
//     approvedBy: null
//   },
// ]) as Ref<any[]> // length 32
