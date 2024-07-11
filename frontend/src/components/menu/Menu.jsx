import React, { useEffect } from "react";
import { forwardRef } from "react";
import { routes } from "../../constants/Index";
import NestedMenuItem from "./NestedMenuItem";
import SingleMenuItem from "./SingleMenuItem";
import { Link } from "react-router-dom";

const Menu = forwardRef(({ menuOpen, setMenuState }, menuRef) => {
    useEffect(() => {
        let activeLink = menuRef.current.querySelector("a.active");
        if (activeLink) {
            activeLink.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [menuOpen]);

    return (
        // main container
        <div
            ref={menuRef}
            className={`fixed z-50 ${
                menuOpen ? "" : "translate-x-full"
            } top-0 flex h-screen overflow-y-auto w-full max-w-60 lg:max-w-72 flex-col rounded-e-xl
         bg-white bg-clip-border py-4 text-gray-700 shadow-xl shadow-blue-gray-900/5 select-none`}
        >
            {/* logo */}
            <Link to={"/"} className="p-4 mb-2">
                <img
                    className="m-auto w-16 h-16"
                    src="/vite.svg"
                    alt="GYM Logo"
                />
            </Link>

            {/* navigation */}
            <nav className="flex min-w-[100%] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                {routes.map((item) => {
                    return item.children ? (
                        <NestedMenuItem
                            item={item}
                            setMenuState={setMenuState}
                            key={item.id}
                        />
                    ) : (
                        <SingleMenuItem
                            item={item}
                            setMenuState={setMenuState}
                        />
                    );
                })}
            </nav>
        </div>
    );
});

export default Menu;
