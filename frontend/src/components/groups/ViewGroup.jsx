import React from "react";

const ViewGroup = ({ title, children }) => {
    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">{title}</h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>

            {children}
        </div>
    );
};

export default ViewGroup;
