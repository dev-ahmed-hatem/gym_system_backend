import React from "react";

const MenuBtn = ({ menuState, setMenuState, className }) => {
    const style = `block absolute left-0 w-full h-[5px] rounded m-0 ${menuState? "bg-accent" : "bg-white"}`;

    const toggleMenu = () => {
        setMenuState(!menuState);
    };

    return (
        <div
            id="menu-btn"
            className={`header-menu w-8 h-6 cursor-pointer ms-0 relative ${className}`}
            onClick={toggleMenu}
        >
            <span
                className={`${style} top-0 ${menuState ? "top-[50%] -translate-y-1/2 rotate-45" : ""}`}
            ></span>
            <span
                className={`${style} top-[50%] -translate-y-1/2 ${
                    menuState ? "hidden" : ""
                }`}
            ></span>
            <span
                className={`${style} bottom-0 ${menuState ? "top-[50%] -translate-y-1/2 -rotate-45" : ""}`}
            ></span>
        </div>
    );
};

export default MenuBtn;
