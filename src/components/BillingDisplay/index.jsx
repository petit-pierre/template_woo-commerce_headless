import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import { updateCurrentCustomerThunk } from "../../thunkActionsCreator/userThunks";
import Loader from "../Loader";

export default function BillingDisplay() {
  const dispatch = useDispatch();
  const customer = useSelector((state) => state.user.customer);
  const [billing, setBilling] = useState(customer?.billing || {});

  const handleBillingChange = (key, value) => {
    setBilling((prev) => ({ ...prev, [key]: value }));
  };
  const handleSubmitBilling = (e) => {
    e.preventDefault();
    dispatch(updateCurrentCustomerThunk({ billing }));
  };

  if (!customer) return <Loader size="lg" />;

  return (
    <div>
      <form onSubmit={handleSubmitBilling} className="update-form">
        <h2>Informations de facturation</h2>
        <div className="input-container">
          {customer &&
            Object.entries(billing).map(([key, value]) => (
              <p key={key}>
                {key} :{" "}
                <input
                  key={key}
                  placeholder={key}
                  value={billing[key] || ""}
                  onChange={(e) => handleBillingChange(key, e.target.value)}
                />
              </p>
            ))}
        </div>
        <button type="submit">Enregistrer informations</button>
      </form>
    </div>
  );
}
