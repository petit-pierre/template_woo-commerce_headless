import { useEffect } from "react";
import { useSelector } from "react-redux";

function ThemeApplier() {
  const palette = useSelector((state) => state.site.palette) ?? [];

  useEffect(() => {
    const colors = [
      ["--primary-color", palette?.[0]?.color ?? "#b17979"],
      ["--primary-color-light", palette?.[1]?.color ?? "#e97575"],
      ["--secondary-color", palette?.[2]?.color ?? "#b29a72"],
      ["--surface-color", palette?.[3]?.color ?? "#f6ece0f6"],
      ["--text-color-muted", palette?.[4]?.color ?? "#575757"],
      ["--danger-color", palette?.[5]?.color ?? "#880000"],
      ["--success-color", palette?.[6]?.color ?? "#006e18"],
      ["--bg-color", palette?.[7]?.color ?? "#fdf5ea"],
      ["--white-color", palette?.[8]?.color ?? "#ffffff"],
      ["--dark-color", palette?.[9]?.color ?? "#000000"],
    ];

    colors.forEach(([name, color]) => {
      document.documentElement.style.setProperty(name, color);
    });
  }, [palette]);

  return null;
}

export default ThemeApplier;
