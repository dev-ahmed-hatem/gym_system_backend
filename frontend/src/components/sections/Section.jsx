import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const Section = ({ item }) => {
    return (
        <div className="wrapper py-6 lg:py-8 px-8 lg:px-12">

            {/* Section Title */}
            <h1 className="font-bold text-2xl text-gray-600 mb-6">{item.title}:</h1>

            {/* Tab Navigation */}
            <div className="border-b border-gray-400 bg-white rounded-t shadow-md">
                <ul className="flex flex-wrap -mb-px lg:text-lg font-medium text-center text-gray-500">
                    <li
                        className="rounded-t bg-primary border-primary text-white
                         me-2 flex justify-center items-center"
                        key={0}
                    >
                        <NavLink
                            to={"/"}
                            className={`flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg
                                          group lg:text-xl w-full
                                         `}
                        >
                            <FaHome />
                        </NavLink>
                    </li>
                    {item.children.map((child) => {
                        return (
                            <li className="me-0 lg:me-2" key={child.id}>
                                <NavLink
                                    to={child.url}
                                    className={({
                                        isActive,
                                    }) => `inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg
                                         hover:text-primary hover:border-primary group
                                         ${
                                             isActive
                                                 ? "text-primary border-primary font-bold"
                                                 : "border-transparent"
                                         }`}
                                >
                                    <span className="me-2">{child.icon}</span>
                                    {child.title}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </div>

            {/* Page Content */}
            <Outlet />
        </div>
    );
};

export default Section;
