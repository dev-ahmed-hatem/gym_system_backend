import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { browserRoutes } from "./constants/Routing.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider
            router={createBrowserRouter(browserRoutes)}
        ></RouterProvider>
    </React.StrictMode>
);
