import React from "react";

const ErrorGroup = ({ title, message }) => {
    return (
        <>
            {/* Error Group */}
            <div
                className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">{title}</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <div className="">
                    <p className="text-lg text-center text-red-600 py-4">
                        {message}
                    </p>
                    <div className="flex flex-wrap max-h-12 min-w-full justify-center"></div>
                </div>
            </div>
        </>
    );
};

export default ErrorGroup;
