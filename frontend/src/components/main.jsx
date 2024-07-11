import React from "react";
import { useState, useRef, useEffect } from "react";
import { useMatch } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Navbar from "./nav/NavBar.jsx";
import Menu from "./menu/Menu.jsx";

const Main = () => {
    const isHome = useMatch("/");
    const menuRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleClick = (event) => {
            if (
                menuRef &&
                !menuRef.current.contains(event.target) &&
                !document.getElementById("menu-btn").contains(event.target)
            ) {
                setMenuOpen(false);
            }
        };
        document.body.addEventListener("click", handleClick);

        return () => {
            document.body.removeEventListener("click", handleClick);
        };
    }, []);

    return (
        <>
            <Navbar menuState={menuOpen} setMenuState={setMenuOpen} />
            <Menu
                menuOpen={menuOpen}
                setMenuState={setMenuOpen}
                ref={menuRef}
            />
            {isHome ? <div>الصفحة الرئيسية</div> : <Outlet />}
        </>
    );
};

export default Main;
