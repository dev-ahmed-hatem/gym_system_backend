import React, { useState } from "react";
import { BsRocketTakeoff } from "react-icons/bs";
import { routes } from "../../constants/Index";
import { Link } from "react-router-dom";
import "./quick-access.css";

const QuickAccess = () => {
    const quick_routes = [
        routes[2].children[0],
        routes[2].children[2],
        routes[3].children[0],
        routes[3].children[2],
    ];

    return (
        <div
            id="qa"
            className="fixed z-50 left-6 lg:left-8 bottom-6 lg:bottom-8 flex"
        >
            <button
                className="rounded-full w-12 h-12 bg-black flex items-center
            justify-center text-white text-xl cursor-pointer shadow-2xl focus:ring-4 focus:text-accent ring-accent"
            >
                <BsRocketTakeoff className="absolute z-10" />
            </button>
            <div
                id="qa-menu"
                className={`routes absolute left-full flex gap-x-2 overflow-hidden`}
                // ${active ? "w-auto" : "w-0"}
            >
                {quick_routes.reverse().map((route, index) => (
                    <Link
                        className="min-w-12 min-h-12 text-white text-lg bg-black hover:bg-accent rounded-full
                        flex items-center justify-center"
                        to={route.url}
                        title={route.title}
                        key={index}
                    >
                        {route.icon}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default QuickAccess;
