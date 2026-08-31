import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OrderDetails from "../OrderDetails";
import "./index.css";

export function OrderAll() {
  const orders = useSelector((state) => state.user.orders);

  const [opened, setOpened] = useState(null);

  useEffect(() => {
    if (opened == null) return;

    const onKey = (e) => {
      if (e.key === "Escape") setOpened(null);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened]);

  if (!orders?.length) {
    return <p>Aucune commande trouvée.</p>;
  }

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  const openedOrder = sortedOrders.find((order) => order.id === opened);

  return (
    <div className="orders-history">
      {sortedOrders.map((order) => (
        <div key={order.id} className="history-order">
          <div className="history-header">
            <div>
              <strong>Commande n°{order.number ?? order.id}</strong>

              <p>
                {order.date &&
                  new Date(order.date).toLocaleDateString("fr-FR")}
              </p>

              <p>{order.status}</p>
            </div>

            <button type="button" onClick={() => setOpened(order.id)}>
              Voir plus
            </button>
          </div>
        </div>
      ))}

      {openedOrder && (
        <div
          className="order-modal-overlay"
          role="presentation"
          onClick={() => setOpened(null)}
        >
          <div
            className="order-modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="order-modal-close"
              aria-label="Fermer"
              onClick={() => setOpened(null)}
            >
              ✕
            </button>

            <OrderDetails orderId={openedOrder.id} />
          </div>
        </div>
      )}
    </div>
  );
}
