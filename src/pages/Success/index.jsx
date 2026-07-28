import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showToast } from "../../slices/toastSlice";
import { useOrder } from "../../components/SuccessMessage";
import OrderDetails from "../../components/OrderDetails";

export default function Success() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { order, isPaid } = useOrder(orderId);

  useEffect(() => {
    dispatch(showToast(`Commande n°${orderId} confirmée`));
  }, [orderId, dispatch]);

  return (
    <div className="success-page">
      <h1>Commande confirmée</h1>
      <p className="thank-you">Merci pour votre commande.</p>

      
      {order && (
        <p className={isPaid ? "payment-ok" : "payment-pending"}>
          {isPaid
            ? `Paiement confirmé pour la commande n°${orderId}`
            : `Paiement en attente de confirmation pour la commande n°${orderId}`}
        </p>
      )}

      {order ? (
        <OrderDetails order={order} variant="confirmation" />
      ) : (
        <p>Les détails de la commande seront affichés ici dès qu'ils seront disponibles.</p>
      )}
    </div>
  );
}