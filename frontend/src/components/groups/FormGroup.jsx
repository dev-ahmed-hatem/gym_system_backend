import React from "react";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";

const FormGroup = ({ title, onSubmit, formFunction, post, children }) => {
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

                    <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                        <Button
                            type="submit"
                            color={formFunction == "add" ? "primary" : "accent"}
                            disabled={post}
                            className="w-32 h-10 flex justify-center items-center"
                            size={"xl"}
                            isProcessing={post}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                        >
                            {formFunction == "add" ? "إضافة" : "تعديل"}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default FormGroup;
