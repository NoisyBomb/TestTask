import { NavLink, Route, Routes } from 'react-router-dom'
import OrdersListPage from './pages/OrdersListPage'
import NewOrderPage from './pages/NewOrderPage'
import OrderDetailsPage from './pages/OrderDetailsPage'

function App() {
  return (
    <div className="shell">
      <header className="shell__header">
        <div className="shell__brand">
          <span className="shell__brand-mark">01</span>
          <div>
            <p className="shell__brand-title">Ведомость приёмки</p>
            <p className="shell__brand-sub">служба доставки груза</p>
          </div>
        </div>
        <nav className="shell__nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Список заказов
          </NavLink>
          <NavLink to="/new" className={({ isActive }) => (isActive ? 'is-active' : '')}>
            Новый заказ
          </NavLink>
        </nav>
      </header>

      <main className="shell__main">
        <Routes>
          <Route path="/" element={<OrdersListPage />} />
          <Route path="/new" element={<NewOrderPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
          <Route path="*" element={<p>Страница не найдена.</p>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
