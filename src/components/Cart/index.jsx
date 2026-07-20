import { useSelector } from "react-redux";
import { CartProduct } from "./CartProduct";

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector((state) => state.cart.totals);

  return (
    <>
      <div>Votre Panier</div>
      <ul>
        {items.map((item) => (
          <CartProduct key={item.key} item={item} />
        ))}
      </ul>
      <button>Vider Panier</button>
      <button>Payer</button>
    </>
  );
}
