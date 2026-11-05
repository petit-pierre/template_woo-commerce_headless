import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteCurrentUserThunk } from "../../thunkActionsCreator/userThunks";
import "./index.css";
import { useState } from "react";

export default function DeleteAccountButton() {
  const [step, setStep] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const [password, setPassword] = useState("");

  const handleDelete = () => {
    dispatch(deleteCurrentUserThunk({ password }))
      .unwrap()
      .then(() => {
        alert("Votre compte a été supprimé avec succès.");
        navigate("/");
      })
      .catch((err) => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    setStep(0);
  };

  return (
    <div className="delete-account-section">
      {step === 0 && (
        <button
          onClick={() => setStep(1)}
          disabled={loading}
          style={{ backgroundColor: "red", color: "white" }}
        >
          Supprimer mon compte
        </button>
      )}
      {step === 1 && (
        <div className="confirmation-step">
          <p>
            Êtes-vous sûr de vouloir supprimer définitivement votre compte ?
            Cette action est irréversible.
          </p>
          <button
            onClick={() => setStep(2)}
            disabled={loading}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Oui, je veux supprimer mon compte
          </button>
          <button
            onClick={() => setStep(0)}
            disabled={loading}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Non, annuler
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="confirmation-step">
          <p>Entrez votre mot de passe pour confirmer la suppression :</p>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Confirmer la suppression de mon compte
          </button>
          <button
            onClick={() => setStep(0)}
            disabled={loading}
            style={{ backgroundColor: "red", color: "white" }}
          >
            Non, annuler
          </button>
        </div>
      )}
      {/* {error && <p style={{ color: "red" }}>{error}</p>} */}
    </div>
  );
}
