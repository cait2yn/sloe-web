import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html, body, #root {
    height: 100%;
  }

  body {
    margin: 0;
    background: ${({ theme }) => theme.color.bg};
    color: ${({ theme }) => theme.color.text};
    font-family: ${({ theme }) => theme.font.sans};
    transition: background-color 0.2s ease, color 0.2s ease;
    -webkit-font-smoothing: antialiased;
  }

  button, input {
    font-family: inherit;
  }

  svg text {
    user-select: none;
  }

  @media (hover: hover) and (pointer: fine) {
    * {
      cursor: none !important;
    }
  }
`;
