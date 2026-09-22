export type ThemeChoice = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

export function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return choice;
}

export function readThemeChoice(): ThemeChoice {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
}

export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  const resolved = resolveTheme(choice);
  root.classList.toggle("dark", resolved === "dark");
  if (choice === "system") root.setAttribute("data-theme", "system");
  else root.removeAttribute("data-theme");
}

export const themeInitScript = `(function(){try{var stored=localStorage.getItem("${THEME_STORAGE_KEY}");var choice=stored==="light"||stored==="dark"||stored==="system"?stored:"system";var dark=choice==="dark"||(choice==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);if(choice==="system")document.documentElement.setAttribute("data-theme","system");}catch(e){}})();`;
