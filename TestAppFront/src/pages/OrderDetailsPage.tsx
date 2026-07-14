import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ApiError, fetchOrder } from '../api/ordersApi'
import type { Order } from '../types'
import StatusBanner from '../components/StatusBanner'
import OrderStamp from '../components/OrderStamp'

type LoadState = 'loading' | 'ready' | 'not-found' | 'error'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function formatDate(isoDate: string) {
  const parsed = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return dateFormatter.format(parsed)
}

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!id) return
      setState('loading')
      try {
        const data = await fetchOrder(id)
        if (cancelled) return
        setOrder(data)
        setState('ready')
      } catch (error) {
        if (cancelled) return
        if (error instanceof ApiError && error.status === 404) {
          setState('not-found')
        } else {
          setState('error')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <section className="page page--narrow">
      <div className="page__head">
        <Link to="/" className="back-link">
          ← к списку заказов
        </Link>
        <h1>Заказ</h1>
      </div>

      {state === 'loading' && <StatusBanner tone="loading">Загружаем заказ…</StatusBanner>}

      {state === 'not-found' && (
        <StatusBanner
          tone="empty"
          action={
            <Link to="/" className="btn btn--ghost">
              Вернуться к списку
            </Link>
          }
        >
          Заказ №{id} не найден. Возможно, он был удалён или номер введён неверно.
        </StatusBanner>
      )}

      {state === 'error' && (
        <StatusBanner
          tone="error"
          action={
            <button type="button" className="btn btn--ghost" onClick={() => window.location.reload()}>
              Повторить попытку
            </button>
          }
        >
          Не получилось загрузить заказ. Проверьте, что backend запущен и доступен.
        </StatusBanner>
      )}

      {state === 'ready' && order && (
        <div className="waybill">
          <div className="waybill__stamp-row">
            <OrderStamp id={order.id} size="lg" />
            <span className="waybill__tag">только чтение</span>
          </div>

          <div className="waybill__grid">
            <div className="waybill__block">
              <p className="waybill__label">Отправитель</p>
              <p className="waybill__value">{order.senderCity}</p>
              <p className="waybill__value waybill__value--muted">{order.senderAddress}</p>
            </div>
            <div className="waybill__block">
              <p className="waybill__label">Получатель</p>
              <p className="waybill__value">{order.receiverCity}</p>
              <p className="waybill__value waybill__value--muted">{order.receiverAddress}</p>
            </div>
            <div className="waybill__block">
              <p className="waybill__label">Вес груза</p>
              <p className="waybill__value mono">{order.weight} кг</p>
            </div>
            <div className="waybill__block">
              <p className="waybill__label">Дата забора груза</p>
              <p className="waybill__value mono">{formatDate(order.orderPickupDate)}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
