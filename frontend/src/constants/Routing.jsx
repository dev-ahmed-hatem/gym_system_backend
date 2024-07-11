import Section from "../components/sections/Section";
import Subsection from "../components/sections/Subsection";
import NotFound from "../NotFound";
import Main from "../components/main";
import { routes } from "./Index";

export const browserRoutes = [
    {
        path: "/",
        element: <Main />,
        errorElement: <NotFound />,
        children: [],
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
