import { apiClient as api } from './client'

export interface InitiatePaymentData {
  contributionId: string
}

export interface InitiatePaymentResponse {
  paymentUrl: string
  transactionId: string
  contributionId: string
}

export const initiateCinetPay = async (organizationId: string, data: InitiatePaymentData): Promise<InitiatePaymentResponse> => {
  const response = await api.post(`/payments/organizations/${organizationId}/cinetpay/initiate`, data)
  return response.data.data
}

export const verifyPayment = async (transactionId: string): Promise<any> => {
  const response = await api.get(`/payments/verify/${transactionId}`)
  return response.data.data
}

export const simulatePayment = async (organizationId: string, data: InitiatePaymentData): Promise<{ success: boolean; transactionId: string }> => {
  const response = await api.post(`/payments/organizations/${organizationId}/simulate-payment`, data)
  return response.data
}
