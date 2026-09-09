import { useEffect } from "react";
import { useSelector } from "react-redux";

function ThemeApplier() {
  const palette = useSelector((state) => state.theme.palette);

  useEffect(() => {
    palette.forEach(({ slug, color }) => {
      document.documentElement.style.setProperty(`--wp--preset--color--${slug}`, color);
    });
  }, [palette]);

  return null;
}

export default ThemeApplier;
