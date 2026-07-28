import StatusBadge from "../StatusBadge";

export default function OrderDetails({ order }) {
  if (!order) {
    return null;
  }

  return (
    <div className="order-details">
      <p>Commande Numéro : {order.number ?? order.id}</p>

      {order.status && (
        <p>
          Statut : <StatusBadge status={order.status} />
        </p>
      )}

      {order.shippingAddress && (
        <div className="shipping-address">
          <h3>Adresse de livraison</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>
            {order.shippingAddress.address}
            {order.shippingAddress.addressComplement
              ? `, ${order.shippingAddress.addressComplement}`
              : ""}
          </p>
          <p>
            {order.shippingAddress.postalCode} {order.shippingAddress.city}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      )}

      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.name} className="order-item">
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                width={64}
                height={64}
                className="order-item-thumbnail"
              />
            )}
            <div>
              <p>{item.name}</p>
              <p>Quantité : {item.quantity}</p>
              <p>Prix : {Number(item.total).toFixed(2)} €</p>
            </div>
          </li>
        ))}
      </ul>

      <p>
        <strong>Total : {Number(order.total).toFixed(2)} €</strong>
      </p>
    </div>
  );
}
