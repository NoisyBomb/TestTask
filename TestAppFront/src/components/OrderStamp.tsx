interface OrderStampProps {
  id: number
  size?: 'sm' | 'lg'
}

/** Renders an order id like a manifest stamp, e.g. "№ 000042" */
export default function OrderStamp({ id, size = 'sm' }: OrderStampProps) {
  const padded = String(id).padStart(6, '0')
  return <span className={`stamp stamp--${size}`}>№ {padded}</span>
}
