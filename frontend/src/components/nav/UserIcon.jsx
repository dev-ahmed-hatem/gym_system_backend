import React from "react";
import { useNavigate } from "react-router-dom";

const UserIcon = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("auth_user"));

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");

        navigate("/login");
    };

    return (
        <div
            className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative"
            id="user-icon"
        >
            <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4
                 focus:ring-white"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
            >
                <img
                    className="w-11 h-11 rounded-full"
                    src="/vite.svg"
                    alt="صورة المستخدم"
                />
            </button>
            <div
                className="z-50 my-4 text-base list-none bg-accent divide-y divide-gray-100 rounded-lg
                 shadow dark:divide-gray-600 absolute top-8 start-1/2 translate-x-[70%] lg:translate-x-1/2 w-44"
                id="user-dropdown"
            >
                <div className="px-4 py-3">
                    <span className="block text-m text-text font-bold">
                        {user?.username}
                    </span>
                    <span className="block text-sm  text-text">
                        {user?.is_superuser ? "مدير" : "مشرف"}
                    </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                        <span
                            onClick={logout}
                            className="block px-4 py-2 text-sm text-black hover:bg-white cursor-pointer"
                        >
                            تسجيل خروج
                        </span>
                    </li>
                </ul>
            </div>
            {/* <button
                data-collapse-toggle="navbar-user"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-user"
                aria-expanded="false"
            >
                <span className="sr-only">Open main menu</span>
                <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 17 14"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 1h15M1 7h15M1 13h15"
                    />
                </svg>
            </button> */}
        </div>
    );
};

export default UserIcon;
