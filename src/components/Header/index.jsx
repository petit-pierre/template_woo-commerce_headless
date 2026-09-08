import "./index.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Autocomplete from "../Autocomplete";
import { logout } from "../../slices/userSlice";
import { openModal } from "../../slices/modalSlice";
import searchIcon from "./search.svg";
import heartIcon from "./heart.svg";
import bagIcon from "./bag.svg";
import peopleIcon from "./people.svg";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const token = useSelector((state) => state.user.token);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const logoUrl = useSelector((state) => state.site.logoUrl);
  const dispatch = useDispatch();
  const isAuthentificated = useSelector((state) => state.user?.token);
  const cartCount = cartItems.reduce(
    (total, item) => total + (Number(item.quantity) || 0),
    0,
  );
  const cartBadgeValue = cartCount > 9 ? "9+" : String(cartCount);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;
    const threshold = 10;
    const updateScroll = () => {
      const y = window.scrollY;
      if (y <= 0) {
        setIsHidden(false);
        lastScrollY = 0;
        ticking = false;
        return;
      }
      const delta = y - lastScrollY;
      if (Math.abs(delta) > threshold) {
        setIsHidden(delta > 0);
        lastScrollY = y;
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isHidden ? "header-hidden" : ""}`}>
      <div className="margin"></div>
      <div className="content">
        {/* <div
            className={`header-overlay ${menuOpen ? "open" : ""}`}
            onClick={closeMenu}
            aria-hidden="true"
          /> */}
        <div className="menu">
          <Link to="/" className="header-logo" aria-label="Ecommerce">
            <img src={logoUrl || "./logo.webp"} alt="Logo" />
            <span className="header-logo-text">
              <strong>LUMÉA</strong>
              <small>BEAUTÉ & BIEN-ÊTRE</small>
            </span>
          </Link>
          <nav
            className={`header-nav ${menuOpen ? "open" : ""}`}
            aria-hidden={!menuOpen}
          >
            <button
              className="header-close"
              onClick={closeMenu}
              aria-label="Fermer le menu"
            >
              ✕
            </button>
            <button
              className="header-burger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
              aria-expanded={menuOpen}
            >
              ☰
            </button>
            <Link to="/catalogue" onClick={closeMenu}>
              Catalogue
            </Link>
            <Link to="/blog" onClick={closeMenu}>
              Blog
            </Link>
          </nav>
          <div className="header-actions">
            <Autocomplete />
            <Link
              to="/catalogue"
              className="header-icon"
              aria-label="Recherche"
            >
              <img src={searchIcon} alt="" className="header-icon-img" />
            </Link>

            {isAuthentificated ? (
              <Link to="/profile" className="header-icon" aria-label="Profil">
                <img src={peopleIcon} alt="" className="header-icon-img" />
              </Link>
            ) : (
              <button
                type="button"
                className="header-icon"
                aria-label="Profil"
                onClick={() => dispatch(openModal({ name: "auth", props: { view: "login" } }))}
              >
                <img src={peopleIcon} alt="" className="header-icon-img" />
              </button>
            )}

            <Link
              to="/panier"
              className="header-icon header-cart-link"
              aria-label={`Panier (${cartBadgeValue})`}
            >
              <img src={bagIcon} alt="" className="header-icon-img" />
              {cartCount > 0 && (
                <span className="header-cart-badge">{cartBadgeValue}</span>
              )}
            </Link>
            <Link
              to="/wishlist"
              className="header-icon header-wishlist-link"
              aria-label={`Favoris (${wishlistItems.length})`}
            >
              <img src={heartIcon} alt="" className="header-icon-img" />
              {wishlistItems.length > 0 && (
                <span className="header-cart-badge">
                  {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                </span>
              )}
            </Link>

            {token && (
              <button className="deconexion" onClick={() => dispatch(logout())}>
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
