import type { NewOrderPayload, Order, ValidationProblem } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5220/api'

/**
 * Thrown when the backend responds with a well-formed error body
 * (validation problem or "not found" problem details).
 */
export class ApiError extends Error {
  status: number
  problem?: ValidationProblem

  constructor(status: number, message: string, problem?: ValidationProblem) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.problem = problem
  }
}

/**
 * Thrown when the request never reached the server (offline, wrong port,
 * CORS misconfiguration, backend not running, etc).
 */
export class NetworkError extends Error {
  constructor(message = 'Не удалось соединиться с сервером') {
    super(message)
    this.name = 'NetworkError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    })
  } catch {
    throw new NetworkError()
  }

  if (response.status === 204) {
    return undefined as T
  }

  const text = await response.text()
  const body = text ? JSON.parse(text) : undefined

  if (!response.ok) {
    const problem = body as ValidationProblem | undefined
    throw new ApiError(response.status, problem?.title ?? 'Ошибка запроса', problem)
  }

  return body as T
}

export function fetchOrders(): Promise<Order[]> {
  return request<Order[]>('/orders')
}

export function fetchOrder(id: number | string): Promise<Order> {
  return request<Order>(`/orders/${id}`)
}

export function createOrder(payload: NewOrderPayload): Promise<Order> {
  return request<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
