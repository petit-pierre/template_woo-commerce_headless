import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../../slices/toastSlice";
import { fetchCurrentUserOrdersThunk } from "../../thunkActionsCreator/userThunks";
import OrderDetails from "../../components/OrderDetails";

export default function Success() {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { token, orders, loading, error } = useSelector((state) => state.user);

  const order = orders.find(
    (item) => String(item.id) === String(orderId) || String(item.number) === String(orderId),
  );
  const isPaid = ["processing", "completed"].includes(order?.status);

  useEffect(() => {
    dispatch(showToast(`Commande n°${orderId} confirmée`));
  }, [orderId, dispatch]);

  useEffect(() => {
    if (token && !order && !loading) {
      dispatch(fetchCurrentUserOrdersThunk());
    }
  }, [dispatch, token, order, loading]);

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