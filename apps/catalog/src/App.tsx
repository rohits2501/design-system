import { useEffect, useState } from "react";
import { Button, Stack, Text } from "@house/react";
import { themeAttribute, themeNames, type ThemeName } from "@house/tokens";
import { Gallery } from "./Gallery.tsx";

type View = "side-by-side" | ThemeName;

const viewLabel: Record<View, string> = {
  "side-by-side": "Side by side",
  light: "Light",
  dark: "Dark",
  highContrast: "High contrast",
};

const themeLabel: Record<ThemeName, string> = {
  light: "Light",
  dark: "Dark",
  highContrast: "High contrast",
};

export function App({ initialView = "side-by-side" }: { initialView?: View }) {
  const [view, setView] = useState<View>(initialView);

  useEffect(() => {
    const root = document.documentElement;
    if (view === "side-by-side") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", themeAttribute[view]);
  }, [view]);

  return (
    <Stack as="main" gap={6} className="catalog">
      <Stack as="header" direction="row" gap={4} align="center" justify="between" wrap>
        <Stack gap={1}>
          <Text as="h1" size="xl" weight="bold">
            House design system
          </Text>
          <Text as="p" size="sm" tone="muted">
            One set of components. Themes are variable overrides on a wrapper.
          </Text>
        </Stack>
        <Stack as="nav" direction="row" gap={2} wrap aria-label="Theme">
          {(Object.keys(viewLabel) as View[]).map((option) => (
            <Button
              key={option}
              size="sm"
              aria-pressed={view === option}
              onClick={() => setView(option)}
            >
              {viewLabel[option]}
            </Button>
          ))}
        </Stack>
      </Stack>

      {view === "side-by-side" ? (
        <div className="catalog-columns">
          {themeNames.map((name) => (
            <div key={name} data-theme={themeAttribute[name]} className="catalog-column">
              <Text as="h2" size="md" weight="bold" className="catalog-column__title">
                {themeLabel[name]}
              </Text>
              <Gallery />
            </div>
          ))}
        </div>
      ) : (
        <div className="catalog-column">
          <Gallery />
        </div>
      )}
    </Stack>
  );
}
