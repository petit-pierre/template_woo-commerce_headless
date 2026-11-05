import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../slices/filtersSlice";
import { fetchProductsThunk } from "../../thunkActionsCreator/productsThunks";
import "./index.css";
import { decodeHtml } from "../../utils/decodeHtml";

export default function Autocomplete({ setMenuOpen }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useSelector((state) => state.filters.search);
  const [focused, setFocused] = useState(false);
  const filters = useSelector((state) => state.filters);
  const { list, loading, error } = useSelector((state) => state.products);

  // Référence vers l'input pour pouvoir manipuler son focus
  const inputRef = useRef(null);

  useEffect(() => {
    dispatch(fetchProductsThunk({ ...filters, page: 1, per_page: 20 }));
  }, [filters, dispatch]);

  const handleChange = (e) => {
    if (location.pathname !== "/catalogue") {
      dispatch(
        setFilters({
          category: "",
          min_price: "",
          max_price: "",
          search: e.target.value,
        }),
      );
    } else {
      dispatch(setFilters({ search: e.target.value }));
    }
  };

  const handleSelect = () => {
    dispatch(setFilters({ search: "" }));
    setFocused(false); // Passe l'état à false pour masquer immédiatement les suggestions
    if (inputRef.current) {
      inputRef.current.blur(); // Retire le focus natif de l'input
    }
    setMenuOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setFocused(false);
      if (inputRef.current) {
        inputRef.current.blur();
      }
      navigate("/catalogue");
    }
  };

  return (
    <div className="autocomplete">
      <input
        ref={inputRef} // On associe la référence ici
        type="search"
        className="autocomplete-input"
        placeholder="Rechercher..."
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
        }}
        aria-label="Rechercher"
      />

      {focused && list?.data?.length > 0 && (
        <ul
          className="autocomplete-suggestions"
          onMouseDown={(e) => e.preventDefault()}
          tabIndex="-1"
        >
          {list.data.map((product) => (
            <li key={product.id}>
              <Link
                to={`/product/${product.id}`}
                onClick={handleSelect}
                tabIndex="-1"
              >
                <img
                  src={
                    product.images[0]?.src ||
                    "https://placeholder.pics/svg/300/DEDEDE/555555/Placeholder"
                  }
                  alt={decodeHtml(product.name) || "la photo du produit"}
                />
                <span>{decodeHtml(product.name)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
