import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { registerThunk } from "../../thunkActionsCreator/userThunks";
import AuthModal from "../../components/AuthModal";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (token) navigate("/");
  }, [navigate, token]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.username.trim())
      newErrors.username = "Le nom d'utilisateur est requis.";
    if (!form.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Entrez une adresse e-mail valide.";
    }
    if (!form.password) {
      newErrors.password = "Le mot de passe est requis.";
    } else if (form.password.length < 6) {
      newErrors.password = "Au moins 6 caractères.";
    }
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer votre mot de passe.";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    const validation = validateStep1();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleBack = () => {
    setErrors({});
    setStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateStep2();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    const { confirmPassword, ...payload } = form;
    dispatch(registerThunk(payload));
  };

  return (
    <AuthModal>
      <h1>Créer un compte</h1>
      <p className="auth-modal__subtitle">Inscrivez-vous pour bénéficier des avantages du site </p>

      <p className="auth-form__step">Étape {step} sur 2</p>

      {step === 1 && (
        <form className="auth-form" onSubmit={handleNext} noValidate>
          <div className="auth-form__field">
            <label htmlFor="username">Nom d'utilisateur</label>
            <input
              id="username"
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className={errors.username ? "input--error" : ""}
              autoComplete="username"
            />
            {errors.username && (
              <span className="auth-form__error">{errors.username}</span>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input--error" : ""}
              autoComplete="email"
            />
            {errors.email && (
              <span className="auth-form__error">{errors.email}</span>
            )}
          </div>

          <div className="auth-form__field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={errors.password ? "input--error" : ""}
              autoComplete="new-password"
            />
            {errors.password && (
              <span className="auth-form__error">{errors.password}</span>
            )}
          </div>

          <button className="auth-form__submit" type="submit">
            Suivant
          </button>
        </form>
      )}

      {step === 2 && (
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-form__field">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "input--error" : ""}
              autoComplete="new-password"
              autoFocus
            />
            {errors.confirmPassword && (
              <span className="auth-form__error">{errors.confirmPassword}</span>
            )}
          </div>

          {error && <p className="auth-form__server-error">{error}</p>}

          <button className="auth-form__submit" type="submit" disabled={loading}>
            {loading ? "Création du compte…" : "Créer un compte"}
          </button>
          <button
            className="auth-form__back"
            type="button"
            onClick={handleBack}
            disabled={loading}
          >
            Précédent
          </button>
        </form>
      )}

      <p className="auth-modal__footer">
        Vous avez déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </AuthModal>
  );
}
