import React from "react";
import { routes } from "../../constants/Index";
import { Link } from "react-router-dom";

const System = () => {
    return (
        <div className={`wrapper p-4`}>
            <h1 className="font-bold text-2xl text-gray-600 mb-6">النظام:</h1>
            {routes.map((route) => (
                <div
                    key={route.id}
                    className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                >
                    <h1 className="font-bold text-text text-lg lg:ps-14">
                        {route.title}
                    </h1>
                    <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                    <div className="sub-routes flex flex-wrap gap-4 justify-center items-center">
                        {route.children.map((child) => (
                            <Link
                                key={child.id}
                                to={child.url}
                                className="flex flex-col gap-y-3 justify-center text-center items-center bg-primary p-5 text-white 
                                    rounded-lg max-sm:w-[46%] min-h-[140px] min-w-28 lg:min-w-32
                                    hover:shadow-xl hover:text-accent text-lg"
                            >
                                <span className="text-2xl">{child.icon}</span>
                                {child.title}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default System;
