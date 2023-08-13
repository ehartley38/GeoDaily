import ReactDOM from "react-dom/client";
import App from "./App";
import "./normalize.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import React from "react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </AuthProvider>
  </BrowserRouter>
);
