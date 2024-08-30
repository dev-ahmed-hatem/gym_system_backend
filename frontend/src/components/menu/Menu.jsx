import React, { useState, useEffect } from "react";
import { forwardRef } from "react";
import { routes } from "../../constants/Index";
import NestedMenuItem from "./NestedMenuItem";
import SingleMenuItem from "./SingleMenuItem";
import { Link } from "react-router-dom";
import { get_gym_data } from "../../config/actions";

const Menu = forwardRef(({ menuOpen, setMenuState }, menuRef) => {
    const [gymData, setGymData] = useState(null);

    useEffect(() => {
        let activeLink = menuRef.current.querySelector("a.active");
        if (activeLink) {
            activeLink.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [menuOpen]);

    useEffect(() => {
        get_gym_data().then(({ gym_data }) => {
            const link = document.querySelector("link[rel~='icon']");
            const title = document.querySelector("title");
            if (title) {
                title.innerHTML = gym_data?.title + " Dashboard";
            }
            if (link) {
                link.href = gym_data?.logo;
            } else {
                const newLink = document.createElement("link");
                newLink.rel = "icon";
                newLink.href = gym_data?.logo;
                document.head.appendChild(newLink);
            }
            setGymData(gym_data);
        });
    }, []);

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
            <Link
                to={"/"}
                className="p-4 mb-2"
                onClick={() => {
                    setMenuState(false);
                }}
            >
                <img
                    className="m-auto w-36 rounded-lg"
                    src={gymData?.logo}
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
