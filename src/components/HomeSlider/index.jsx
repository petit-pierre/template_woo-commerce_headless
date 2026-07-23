import "./index.css";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { fetchProductsThunk } from "../../thunkActionsCreator/productsThunks";
import { addProductToCart } from "../../thunkActionsCreator/cartThunks";

const CARD_WIDTH = 160;
const GAP = 16;
const STEP = CARD_WIDTH + GAP;
const VIEWPORT_WIDTH = CARD_WIDTH * 3 + GAP * 2;

export default function HomeSlider() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    dispatch(
      fetchProductsThunk({
        orderby: "popularity",
        order: "desc",
        page: 1,
        per_page: 15,
      }),
    );
  }, [dispatch]);

  const products = list?.data || [];
  const total = products.length;

  const moveBy = (steps) => {
    setCurrentIndex((i) => (((i + steps) % total) + total) % total);
  };
  const goNext = () => moveBy(1);
  const goPrev = () => moveBy(-1);

  useEffect(() => {
    if (total === 0 || isDragging) return;
    const interval = setInterval(goNext, 4000);
    return () => clearInterval(interval);
  }, [total, isDragging]);

  const addProduct = (productId) => {
    dispatch(addProductToCart({ productId, quantity: 1, variation: [] }));
  };

  const handlePointerDown = (e) => {
    if (e.pointerType !== "mouse") return;
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handlePointerMove = (e) => {
    if (!isDragging || e.pointerType !== "mouse") return;
    setDragOffset(e.clientX - dragStartX.current);
  };

  const endDrag = () => {
    if (!isDragging) return;
    const steps = Math.round(-dragOffset / STEP);
    if (steps !== 0) moveBy(steps);
    setDragOffset(0);
    setIsDragging(false);
  };

  if (loading) return <p>Chargement...</p>;
  if (total === 0) return null;

  // Un saut qui traverse la limite du tableau (dernier -> premier ou
  // inversement) ne doit pas s'animer sur toute la largeur du track.
  const wrapped = Math.abs(currentIndex - prevIndexRef.current) > total / 2;
  prevIndexRef.current = currentIndex;

  // On ajoute le dernier produit avant le premier et le premier après le
  // dernier, pour que l'aperçu soit correct même aux deux extrémités.
  const extended = [products[total - 1], ...products, products[0]];
  const slotIndex = currentIndex + 1;

  const baseOffset = VIEWPORT_WIDTH / 2 - CARD_WIDTH / 2 - slotIndex * STEP;

  return (
    <div className="home-slider">
      <h2>Produits du moment</h2>

      <div
        className="home-slider-viewport"
        style={{ width: VIEWPORT_WIDTH }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        <div
          className="home-slider-track"
          style={{
            transform: `translateX(${baseOffset + dragOffset}px)`,
            transition: isDragging || wrapped ? "none" : "transform 0.4s ease",
          }}
        >
          {extended.map((product, index) => (
            <div
              key={`slot-${index}`}
              className={
                "home-slider-product" + (index === slotIndex ? " active" : "")
              }
              style={{ width: CARD_WIDTH }}
            >
              <Link to={"/product/" + product.slug}>
                <img
                  src={product.images[0]?.src}
                  alt={product.name}
                  draggable={false}
                />
                <p dangerouslySetInnerHTML={{ __html: product.name }}></p>
                <p dangerouslySetInnerHTML={{ __html: product.price_html }}></p>
              </Link>
              {index === slotIndex && (
                <button onClick={() => addProduct(product.id)}>
                  Ajouter au panier
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="home-slider-buttons">
        <button onClick={goPrev}>{"<"}</button>
        <button onClick={goNext}>{">"}</button>
      </div>
    </div>
  );
}
