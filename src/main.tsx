import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App";
import "./i18n";
import "./assets/css/fonts.css";
import "./assets/css/tailwind.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
