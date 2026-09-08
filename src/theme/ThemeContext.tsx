import type { ReactNode } from "react";
import { ThemeProvider as SCThemeProvider } from "styled-components";
import { lightTheme } from "./theme";
import { GlobalStyle } from "./GlobalStyle";

// Light mode only for now — darkTheme in ./theme.ts is ready to wire back in
// via a mode toggle if that's wanted later.
export function AppThemeProvider({ children }: { children: ReactNode }) {
  return (
    <SCThemeProvider theme={lightTheme}>
      <GlobalStyle />
      {children}
    </SCThemeProvider>
  );
}
