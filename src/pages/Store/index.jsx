import { useSelector } from "react-redux";
import Feed from "../../components/Feed";
import Filters from "../../components/Filters";
import femme from "./backgrounds/femme.jpg";
import homme from "./backgrounds/homme.jpg";
import mixte from "./backgrounds/mixte.jpg";
import "./index.css";

const BACKGROUNDS = { femme, homme, mixte };
export default function Store() {
  const catId = useSelector((state) => state.filters.category);
  const categories = useSelector((state) => state.categories.items);
  const slug = categories.find((cat) => cat.id.toString() === catId)?.slug;
  const bg = BACKGROUNDS[slug];

  return (
    <main className="store-page">
      <Filters />
      <div>
        <Feed />
        <div
          className="category-bg"
          style={{ "--cat-bg": bg ? `url(${bg})` : "none" }}
        ></div>
      </div>
    </main>
  );
}
