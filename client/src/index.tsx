import ReactDOM from "react-dom/client";
import App from "./App";
import "./normalize.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import React from "react";
import { UserDataProvider } from "./context/UserDataProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <AuthProvider>
      <UserDataProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </UserDataProvider>
    </AuthProvider>
  </BrowserRouter>
);
