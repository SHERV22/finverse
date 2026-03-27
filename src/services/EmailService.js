import emailjs from '@emailjs/browser'

const toBase64 = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })

export const sendReportByEmail = async ({ recipientEmail, pdfBlob, summary, periodLabel }) => {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('Email settings are missing. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your .env file.')
  }

  const pdfDataUrl = await toBase64(pdfBlob)
  const pdfBase64 = String(pdfDataUrl).split(',')[1] ?? ''

  const templateParams = {
    to_email: recipientEmail,
    report_period: periodLabel,
    total_income: summary.totalIncome.toFixed(2),
    total_expenses: summary.totalExpenses.toFixed(2),
    balance: summary.balance.toFixed(2),
    report_filename: `finance-report-${Date.now()}.pdf`,
    report_pdf_base64: pdfBase64,
  }

  await emailjs.send(serviceId, templateId, templateParams, { publicKey })
}
