import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import App from "./App.tsx";
import store from "./store/configStore.ts";
import {Provider} from "react-redux";
import "./i18n";
import "./assets/css/fonts.css";
import "./assets/css/tailwind.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
