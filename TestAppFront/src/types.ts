export interface Order {
  id: number
  senderCity: string
  senderAddress: string
  receiverCity: string
  receiverAddress: string
  weight: number
  orderPickupDate: string // "yyyy-MM-dd"
}

export type NewOrderPayload = Omit<Order, 'id'>

export interface ValidationProblem {
  type?: string
  title: string
  status: number
  errors?: Record<string, string[]>
  traceId?: string
}
