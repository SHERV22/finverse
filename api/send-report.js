/* global process */

import { Resend } from 'resend'

const getParsedBody = (req) => {
  if (req.body && typeof req.body === 'object') {
    return req.body
  }

  if (typeof req.body === 'string') {
    return JSON.parse(req.body)
  }

  return null
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  // Large base64 PDFs may exceed Vercel Serverless Function body size limits.
  let body

  try {
    body = getParsedBody(req)
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body.' })
  }

  const {
    recipientEmail,
    periodLabel,
    summary,
    pdfBase64,
    reportFileName = `finance-report-${new Date().toISOString().slice(0, 10)}.pdf`,
  } = body || {}

  if (!recipientEmail || !summary || !pdfBase64) {
    return res.status(400).json({ error: 'Missing required fields: recipientEmail, summary, pdfBase64.' })
  }

  const resendApiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'

  if (!resendApiKey) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured on the server.' })
  }

  try {
    const resend = new Resend(resendApiKey)

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111;">
        <h2>Personal Finance Report</h2>
        <p><strong>Period:</strong> ${periodLabel || 'Custom range'}</p>
        <ul>
          <li><strong>Total Income:</strong> $${Number(summary.totalIncome || 0).toFixed(2)}</li>
          <li><strong>Total Expenses:</strong> $${Number(summary.totalExpenses || 0).toFixed(2)}</li>
          <li><strong>Balance:</strong> $${Number(summary.balance || 0).toFixed(2)}</li>
        </ul>
        <p>Your PDF report is attached.</p>
      </div>
    `

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: `Finance Report - ${periodLabel || 'Custom Range'}`,
      html,
      attachments: [
        {
          filename: reportFileName,
          content: pdfBase64,
        },
      ],
    })

    if (emailResult.error) {
      return res.status(500).json({ error: emailResult.error.message || 'Failed to send email with Resend.' })
    }

    return res.status(200).json({ ok: true, id: emailResult.data?.id ?? null })
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Unexpected server error while sending email.' })
  }
}
