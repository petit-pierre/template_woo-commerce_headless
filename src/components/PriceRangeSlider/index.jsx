import { useDispatch, useSelector } from "react-redux";
import { setFilters } from "../../slices/filtersSlice";
import "./index.css";

export default function PriceRangeSlider() {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filters);
  const minLimit = 0;
  const maxLimit = 10000;
  const priceGap = 500;

  // Récupération des valeurs depuis Redux
  const minPrice =
    filters.min_price !== "" && filters.min_price !== undefined
      ? Number(filters.min_price)
      : minLimit;
  const maxPrice =
    filters.max_price !== "" && filters.max_price !== undefined
      ? Number(filters.max_price)
      : maxLimit;

  // Gestion des curseurs
  const handleMinRange = (e) => {
    const value = Number(e.target.value);
    if (maxPrice - value >= priceGap) {
      dispatch(setFilters({ min_price: value }));
    }
  };

  const handleMaxRange = (e) => {
    const value = Number(e.target.value);
    if (value - minPrice >= priceGap) {
      dispatch(setFilters({ max_price: value }));
    }
  };

  // Gestion des champs texte
  const handleMinInput = (e) => {
    dispatch(setFilters({ min_price: e.target.value }));
  };

  const handleMaxInput = (e) => {
    dispatch(setFilters({ max_price: e.target.value }));
  };

  // Calcul du remplissage
  const leftPercent = (minPrice / maxLimit) * 100;
  const rightPercent = 100 - (maxPrice / maxLimit) * 100;

  return (
    <div className="main">
      <div className="custom-wrapper">
        <div className="header">
          <h2>Fourchette des prix</h2>
        </div>
        <div className="price-input-container">
          <div className="price-input">
            <div className="price-field">
              <span>Prix minimum (€) </span>
              <input
                type="number"
                className="min-input"
                name="min_price"
                value={filters.min_price ?? ""}
                onChange={handleMinInput}
              />
            </div>
            <div className="price-field">
              <span>Prix maximum (€)</span>
              <input
                type="number"
                className="max-input"
                name="max_price"
                value={filters.max_price ?? ""}
                onChange={handleMaxInput}
              />
            </div>
          </div>
          <div className="slider">
            <div
              className="price-slider"
              style={{
                left: `${leftPercent}%`,
                right: `${rightPercent}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="range-input">
          <input
            type="range"
            className="min-range"
            min={minLimit}
            max={maxLimit}
            value={minPrice}
            step="1"
            onChange={handleMinRange}
          />
          <input
            type="range"
            className="max-range"
            min={minLimit}
            max={maxLimit}
            value={maxPrice}
            step="1"
            onChange={handleMaxRange}
          />
        </div>
      </div>
    </div>
  );
}
