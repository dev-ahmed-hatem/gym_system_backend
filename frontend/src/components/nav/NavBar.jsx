import React from "react";
import { FaHome } from "react-icons/fa";
import "./nav.css";
import MenuBtn from "./Menubtn";
import UserIcon from "./UserIcon";
import { Link } from "react-router-dom";
import { LuScanLine } from "react-icons/lu";

const Navbar = ({ menuState, setMenuState }) => {
    const iconStyle = `text-[29px] text-white cursor-pointer`;

    return (
        <nav
            className={`h-16 bg-primary flex items-center justify-between
                        px-8 lg:px-20 ${
                            menuState ? "ps-[250px] lg:ps-[300px]" : ""
                        } `}
        >
            {/* icons */}
            <div className="icons flex items-center">
                <MenuBtn menuState={menuState} setMenuState={setMenuState} />
                <Link to={"/"}>
                    <FaHome
                        className={`${iconStyle} mx-5 lg:mx-7 hover:text-accent`}
                    />
                </Link>
                <Link to={"/barcode/today"}>
                    <LuScanLine className={`${iconStyle} hover:text-text`} />
                </Link>
            </div>

            {/* <h1 className="text-white font-bold text-2xl ">GYM Name</h1> */}

            {/* user */}
            <UserIcon />
        </nav>
    );
};

export default Navbar;
