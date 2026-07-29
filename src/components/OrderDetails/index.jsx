import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserOrdersThunk } from "../../thunkActionsCreator/userThunks";
import { showToast } from "../../slices/toastSlice";
import SuccessMessage from "../SuccessMessage";

export default function OrderDetails() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { token, orders, loading } = useSelector((state) => state.user);

  const order = orders.find(
    (item) => String(item.id) === orderId || String(item.number) === orderId,
  );
  const isPaid = ["processing", "completed"].includes(order?.status);

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
        <SuccessMessage order={order} />
      ) : (
        <p>
          {token
            ? "Chargement des détails de la commande..."
            : "Connectez-vous pour voir les détails de votre commande."}
        </p>
      )}
    </div>
  );
}
