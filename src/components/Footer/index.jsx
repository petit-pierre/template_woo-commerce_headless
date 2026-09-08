import "./index.css";

import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openModal } from "../../slices/modalSlice";
import { logout } from "../../slices/userSlice";

export default function Footer() {
  const dispatch = useDispatch();
  const isAuthentificated = !!useSelector((state) => state.user?.token);
  const siteName = useSelector((state) => state.site.name);
  const siteDescription = useSelector((state) => state.site.description);
  const logoUrl = useSelector((state) => state.site.logoUrl);

  return (
    <footer className="footer">
      <div className="footer_grid">
        <div className="footer_col footer_col--brand">
          <img
            src={logoUrl || "./logo.webp"}
            alt={siteName || "Logo"}
            className="footer_logo"
          />
          {siteName && <p className="footer_site-name">{siteName}</p>}
          {siteDescription && (
            <p className="footer_description">{siteDescription}</p>
          )}
        </div>

        <div className="footer_col">
          <h4 className="footer_title">Navigation</h4>
          <ul className="footer_links">
            <li>
              <Link to="/">Accueil</Link>
            </li>
            <li>
              <Link to="/catalogue">Catalogue</Link>
            </li>
            <li>
              <Link to="/panier">Panier</Link>
            </li>
            {isAuthentificated ? (
              <li>
                <button
                  type="button"
                  className="footer_link-button"
                  onClick={() => dispatch(logout())}
                >
                  Déconnexion
                </button>
              </li>
            ) : (
              <li>
                <button
                  type="button"
                  className="footer_link-button"
                  onClick={() => dispatch(openModal({ name: "auth", props: { view: "login" } }))}
                >
                  Se connecter
                </button>
              </li>
            )}
          </ul>
        </div>

        <div className="footer_col">
          <h4 className="footer_title">Informations</h4>
          <ul className="footer_links">
            <li>
              <Link to="/cgu">CGU</Link>
            </li>
            <li>
              <Link to="/cgv">CGV</Link>
            </li>
            <li>
              <Link to="/mentions-legales">Mentions légales</Link>
            </li>
            <li>
              <Link to="/contact">Nous contacter</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer_bottom">
        <p>
          © {new Date().getFullYear()} {siteName || "Notre boutique"}. Tous
          droits réservés.
        </p>
      </div>
    </footer>
  );
}
