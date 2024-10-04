import React from "react";
import { useState, useRef, useEffect } from "react";
import { useMatch, Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./nav/NavBar.jsx";
import Menu from "./menu/Menu.jsx";
import Home from "./home/Home.jsx";
import { verifyToken } from "../config/axiosconfig.js";
import Loading from "./groups/Loading.jsx";
import DrawerProvider from "../providers/DrawerProvider.jsx";
import ToastProvider from "../providers/ToastProvider.jsx";
import QuickAccess from "./quick-access/QuickAccess.jsx";
import PermissionProvider from "../providers/PermissionProvider.jsx";

const Main = () => {
    const navigate = useNavigate();
    const isHome = useMatch("/");
    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    // handles onscreen clicks
    useEffect(() => {
        const handleClick = (event) => {
            if (
                menuRef &&
                !menuRef.current.contains(event.target) &&
                !document.getElementById("menu-btn")?.contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.body.addEventListener("click", handleClick);

        return () => {
            document.body.removeEventListener("click", handleClick);
        };
    }, []);

    useEffect(() => {
        const navigateToLogin = () => {
            if (location.pathname == "/login") return;
            let next = encodeURI(location.pathname);
            if (next == "/login") {
                navigate(`/login`);
            } else {
                navigate(`/login?next=${next}`);
            }
        };

        const checkToken = async () => {
            const token = localStorage.getItem("access_token");
            if (token) {
                const isValid = await verifyToken(token);
                if (!isValid) {
                    navigateToLogin();
                }
            } else {
                navigateToLogin();
            }
            setIsLoading(false);
        };

        checkToken();
    }, [navigate, location.pathname]);

    return (
        <>
            {isLoading ? (
                <div className="full-screen w-full h-svh overflow-hidden flex items-center">
                    <Loading />
                </div>
            ) : (
                <ToastProvider>
                    <PermissionProvider>
                        <DrawerProvider>
                            <Navbar
                                menuState={menuOpen}
                                setMenuState={setMenuOpen}
                            />
                            <Menu
                                menuOpen={menuOpen}
                                setMenuState={setMenuOpen}
                                ref={menuRef}
                            />
                            {isHome ? <Home /> : <Outlet />}
                            <QuickAccess />
                        </DrawerProvider>
                    </PermissionProvider>
                </ToastProvider>
            )}
        </>
    );
};

export default Main;
