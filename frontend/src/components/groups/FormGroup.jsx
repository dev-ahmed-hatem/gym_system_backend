import React from "react";
import { Button } from "flowbite-react";

const FormGroup = ({ title, onSubmit, children }) => {
    return (
        <>
            {/* Form Group */}
            <div
                className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">{title}</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <form
                    className="fields flex gap-x-10 gap-y-6 flex-wrap"
                    onSubmit={onSubmit}
                >
                    {children}
                </form>
            </div>
        </>
    );
};

export default FormGroup;
