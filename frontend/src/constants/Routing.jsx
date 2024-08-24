import Section from "../components/sections/Section";
import Subsection from "../components/sections/Subsection";
import NotFound from "../NotFound";
import Main from "../components/Main";
import { routes } from "./Index";
import Login from "../components/login/Login";

export const browserRoutes = [
    {
        path: "/",
        element: <Main />,
        errorElement: <NotFound />,
        children: [],
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: "/logout",
        element: <Main />,
        errorElement: <NotFound />,
    },
];

routes.map((route) => {
    browserRoutes[0]["children"].push({
        path: route.url,
        element: <Section item={route} />,
        errorElement: <NotFound />,
        children: route.children.map((child) => {
            return {
                path: child.url,
                element: child.element? child.element : <Subsection />,
            };
        }),
    });
});
