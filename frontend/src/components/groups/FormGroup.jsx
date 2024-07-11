import React from "react";
import { Button } from "flowbite-react";
import { Flowbite, theme } from "flowbite-react";

// customize default theme
theme.textInput.field.input.colors = {
    ...theme.textInput.field.input.colors,
    primary:
        "border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary",
};

theme.button.color = {
    ...theme.button.color,
    primary: "bg-primary hover:bg-primary-500 text-white",
    accent: "bg-accent hover:bg-accent-500 text-white",
};

const FormGroup = ({ title, buttonTitle, onSubmit, post, children }) => {
    return (
        <>
            <Flowbite theme={{ theme: theme }}>
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
                                color={
                                    buttonTitle == "add" ? "primary" : "accent"
                                }
                                disabled={post}
                            >
                                {buttonTitle == "add" ? "إضافة" : "تعديل"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Flowbite>
        </>
    );
};

export default FormGroup;
