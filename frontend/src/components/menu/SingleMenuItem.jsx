import React from "react";
import { NavLink } from "react-router-dom";
import { useMatch } from "react-router-dom";

const SingleMenuItem = ({ item, setMenuState }) => {
    const isActive = useMatch(item.url);

    const closeMenu = () => {
        setMenuState(false);
    };

    return (
        <>
            <NavLink className={`block mx-3 my-1`} to={item.url} onClick={closeMenu}>
                <div
                    className={`flex w-full justify-between items-center px-4 hover:bg-primary ${
                        isActive ? "bg-primary text-white" : ""
                    } rounded h-10`}
                >
                    <div className={`flex items-center`}>
                        <span className="me-2 lg:me-3">{item.icon}</span>
                        {item.title}
                    </div>
                </div>
            </NavLink>
        </>
    );
};

export default SingleMenuItem;
