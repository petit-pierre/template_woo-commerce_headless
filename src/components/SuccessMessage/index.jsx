import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUserOrdersThunk } from "../../thunkActionsCreator/userThunks";

export function useOrder(orderId) {
  const dispatch = useDispatch();
  const { token, orders, loading, error } = useSelector((state) => state.user);

  const order = orders.find(
    (item) => String(item.id) === String(orderId) || String(item.number) === String(orderId),
  );

  useEffect(() => {
    if (token && !order && !loading) {
      dispatch(fetchCurrentUserOrdersThunk());
    }
  }, [dispatch, token, order, loading]);

  const isPaid = ["processing", "completed"].includes(order?.status);

  return { order, isPaid, loading, error, token };
}