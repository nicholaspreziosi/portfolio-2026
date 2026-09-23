export type ThemeChoice = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

const THEME_MAX_AGE = 60 * 60 * 24 * 365;

function isThemeChoice(value: string | null): value is ThemeChoice {
  return value === "light" || value === "dark" || value === "system";
}

function readCookie(name: string): string | null {
  const prefix = `${name}=`;
  let last: string | null = null;
  for (const part of document.cookie.split(";")) {
    const trimmed = part.trim();
    if (!trimmed.startsWith(prefix)) continue;
    try {
      last = decodeURIComponent(trimmed.slice(prefix.length));
    } catch {
      last = trimmed.slice(prefix.length);
    }
  }
  return last;
}

export function resolveTheme(choice: ThemeChoice): "light" | "dark" {
  if (choice === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return choice;
}

export function readThemeChoice(): ThemeChoice {
  try {
    const fromCookie = readCookie(THEME_STORAGE_KEY);
    if (isThemeChoice(fromCookie)) return fromCookie;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeChoice(stored)) return stored;
  } catch {
    /* private mode */
  }
  return "system";
}

export function persistThemeChoice(choice: ThemeChoice) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, choice);
  } catch {
    /* private mode */
  }
  document.cookie = `${THEME_STORAGE_KEY}=${encodeURIComponent(choice)}; Path=/; Max-Age=${THEME_MAX_AGE}; SameSite=Lax`;
}

export function commitThemeChoice(choice: ThemeChoice) {
  const root = document.documentElement;
  root.classList.add("disable-transitions");
  applyTheme(choice);
  persistThemeChoice(choice);
  root.dispatchEvent(new Event("themechange"));
  requestAnimationFrame(() => {
    requestAnimationFrame(() => root.classList.remove("disable-transitions"));
  });
}

export function applyTheme(choice: ThemeChoice) {
  const root = document.documentElement;
  const resolved = resolveTheme(choice);
  root.classList.toggle("dark", resolved === "dark");
  root.setAttribute("data-theme-choice", choice);
  if (choice === "system") root.setAttribute("data-theme", "system");
  else root.removeAttribute("data-theme");
}

export const themeInitScript = `(function(){function readCookie(name){var prefix=name+"=";var parts=document.cookie.split(";");var last=null;for(var i=0;i<parts.length;i++){var trimmed=parts[i].trim();if(trimmed.indexOf(prefix)===0){try{last=decodeURIComponent(trimmed.slice(prefix.length));}catch(e){last=trimmed.slice(prefix.length);}}}return last;}function isChoice(value){return value==="light"||value==="dark"||value==="system";}try{var root=document.documentElement;var choice=readCookie("${THEME_STORAGE_KEY}");if(!isChoice(choice)){try{choice=localStorage.getItem("${THEME_STORAGE_KEY}");}catch(e){choice=null;}}if(!isChoice(choice))choice="system";var dark=choice==="dark"||(choice==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);root.classList.toggle("dark",dark);root.setAttribute("data-theme-choice",choice);if(choice==="system")root.setAttribute("data-theme","system");else root.removeAttribute("data-theme");try{localStorage.setItem("${THEME_STORAGE_KEY}",choice);}catch(e){}document.cookie="${THEME_STORAGE_KEY}="+encodeURIComponent(choice)+"; Path=/; Max-Age=${THEME_MAX_AGE}; SameSite=Lax";}catch(e){}})();`;
