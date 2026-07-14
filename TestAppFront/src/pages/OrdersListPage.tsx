import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchOrders } from '../api/ordersApi'
import type { Order } from '../types'
import StatusBanner from '../components/StatusBanner'
import OrderStamp from '../components/OrderStamp'

type LoadState = 'loading' | 'ready' | 'error'

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

function formatDate(isoDate: string) {
  const parsed = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return isoDate
  return dateFormatter.format(parsed)
}

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function load() {
      setState('loading')
      try {
        const data = await fetchOrders()
        if (cancelled) return
        setOrders(data)
        setState('ready')
      } catch {
        if (cancelled) return
        setState('error')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="page">
      <div className="page__head">
        <h1>Заказы на доставку</h1>
        <p className="page__lede">Полный перечень принятых заказов, новые записи — сверху.</p>
      </div>

      {state === 'loading' && <StatusBanner tone="loading">Загружаем список заказов…</StatusBanner>}

      {state === 'error' && (
        <StatusBanner
          tone="error"
          action={
            <button type="button" className="btn btn--ghost" onClick={() => window.location.reload()}>
              Повторить попытку
            </button>
          }
        >
          Не получилось загрузить заказы. Проверьте, что backend запущен и доступен.
        </StatusBanner>
      )}

      {state === 'ready' && orders.length === 0 && (
        <StatusBanner tone="empty">
          Заказов пока нет. Как только появится первый заказ, он окажется здесь.
        </StatusBanner>
      )}

      {state === 'ready' && orders.length > 0 && (
        <div className="ledger">
          <table className="ledger__table">
            <thead>
              <tr>
                <th scope="col">№ заказа</th>
                <th scope="col">Город отправителя</th>
                <th scope="col">Адрес отправителя</th>
                <th scope="col">Город получателя</th>
                <th scope="col">Адрес получателя</th>
                <th scope="col">Вес, кг</th>
                <th scope="col">Дата забора</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  tabIndex={0}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/orders/${order.id}`)
                    }
                  }}
                >
                  <td>
                    <OrderStamp id={order.id} />
                  </td>
                  <td>{order.senderCity}</td>
                  <td>{order.senderAddress}</td>
                  <td>{order.receiverCity}</td>
                  <td>{order.receiverAddress}</td>
                  <td className="mono">{order.weight}</td>
                  <td className="mono">{formatDate(order.orderPickupDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
