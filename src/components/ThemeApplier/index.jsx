import { useEffect } from "react";
import { useSelector } from "react-redux";

function ThemeApplier() {
  const palette = useSelector((state) => state.site.palette) ?? [];

  useEffect(() => {
    palette.forEach(({ name, color }) => {
      document.documentElement.style.setProperty(name, color);
    });
  }, [palette]);

  return null;
}

export default ThemeApplier;
