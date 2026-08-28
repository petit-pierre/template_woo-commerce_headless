import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { updateCurrentCustomerThunk } from "../../thunkActionsCreator/userThunks";
import Loader from "../Loader";

export default function ShippingDisplay() {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const [shipping, setShipping] = useState(customer?.shipping || {});

  const handleShippingChange = (key, value) => {
    setShipping((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmitShipping = (e) => {
    e.preventDefault();
    dispatch(updateCurrentCustomerThunk({ shipping }));
  };

  if (!customer) return <Loader size="lg" />;

  return (
    <div>
      <form onSubmit={handleSubmitShipping} className="update-form">
        <h2>Informations de livraison</h2>
        <div className="input-container">
          {customer &&
            Object.entries(shipping).map(([key, value]) => (
              <p key={key}>
                {key} :{" "}
                <input
                  key={key}
                  placeholder={key}
                  value={shipping[key] || ""}
                  onChange={(e) => handleShippingChange(key, e.target.value)}
                />
              </p>
            ))}
        </div>
        <button type="submit">Enregistrer informations</button>
      </form>
    </div>
  );
}
