import Feed from "../../components/Feed";
import Filters from "../../components/Filters";
import PriceRangeSlider from "../../components/PriceRangeSlider";
export default function Store() {
  return (
    <>
      <PriceRangeSlider />
      <Filters />
      <Feed />
    </>
  );
}
