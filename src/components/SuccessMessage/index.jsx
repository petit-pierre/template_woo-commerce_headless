import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserOrdersThunk } from "../../thunkActionsCreator/userThunks";
import { showToast } from "../../slices/toastSlice";
import OrderDetails from "../OrderDetails";

export function useOrder(orderId) {
  const dispatch = useDispatch();
  const { token, orders, customer, loading, error } = useSelector((state) => state.user);

  const rawOrder = orders.find(
    (item) => String(item.id) === String(orderId) || String(item.number) === String(orderId),
  );

  useEffect(() => {
    if (token && !rawOrder && !loading) {
      dispatch(fetchCurrentUserOrdersThunk());
    }
  }, [dispatch, token, rawOrder, loading]);

  const shipping = customer?.shipping;
  const shippingAddress = shipping
    ? {
        fullName: `${shipping.firstName || ""} ${shipping.lastName || ""}`.trim(),
        address: shipping.address1,
        addressComplement: shipping.address2,
        postalCode: shipping.postcode,
        city: shipping.city,
        country: shipping.country,
      }
    : null;

  const order = rawOrder ? { ...rawOrder, shippingAddress } : rawOrder;

  const isPaid = ["processing", "completed"].includes(order?.status);

  return { order, isPaid, loading, error, token };
}

export default function SuccessMessage() {
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
        <OrderDetails order={order} />
      ) : (
        <p>Les détails de la commande seront affichés ici dès qu'ils seront disponibles.</p>
      )}
    </div>
  );
}