function StatusBadge({ status }) {
  const labels = {
    pending: "En attente de paiement",
    paid: "Payée",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  };
  return <span className={`badge badge-${status}`}>{labels[status] ?? status}</span>;
}

export default function OrderDetails({ order, variant = "detailed" }) {
  if (!order) return null;

  const { number, id, items = [], shippingAddress, status } = order;
  const total = Number(order.total || 0).toFixed(2);

  if (variant === "compact") {
    return (
      <div className="order-row">
        <span>Commande n°{number ?? id}</span>
        <span>{items.length} article{items.length > 1 ? "s" : ""}</span>
        <span>{total} €</span>
        <StatusBadge status={status} />
      </div>
    );
  }

  const showStatus = variant === "detailed";
  const showPricing = variant === "detailed" || variant === "confirmation";

  return (
    <div className="order-details">
      <p>Commande Numéro : {number ?? id}</p>
      {showStatus && status && <p>Statut : <StatusBadge status={status} /></p>}

      {shippingAddress && (
        <div className="shipping-address">
          <h3>Adresse de livraison</h3>
          <p>{shippingAddress.fullName}</p>
          <p>
            {shippingAddress.address}
            {shippingAddress.addressComplement ? `, ${shippingAddress.addressComplement}` : ""}
          </p>
          <p>{shippingAddress.postalCode} {shippingAddress.city}</p>
          <p>{shippingAddress.country}</p>
        </div>
      )}

      <ul className="order-items">
        {items.map((item) => (
          <li key={item.id ?? item.name} className="order-item">
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
            </div>
          </li>
        ))}
      </ul>

      <p><strong>Total : {total} €</strong></p>
    </div>
  );
}