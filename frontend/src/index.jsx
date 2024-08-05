import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";
import { browserRoutes } from "./constants/Routing.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AuthProvider } from "./constants/AuthContext.jsx";
import { Flowbite } from "flowbite-react";
import theme from "./assets/FlowbiteTheme.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Flowbite theme={{ theme: theme }}>
            <AuthProvider>
                <RouterProvider
                    router={createBrowserRouter(browserRoutes)}
                ></RouterProvider>
            </AuthProvider>
        </Flowbite>
    </React.StrictMode>
);
