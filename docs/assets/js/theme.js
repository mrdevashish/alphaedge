export function applyThemeToChart(ctx, theme){
  const dark = theme!=="light";
  return {
    backgroundColor: dark ? "#0e1322" : "#ffffff",
    borderColor: dark ? "#4e8cff" : "#0066cc",
    gridColor: dark ? "#444" : "#ddd",
    textColor: dark ? "#eee" : "#111"
  };
}
