import React from "react";
import { Spinner } from "flowbite-react";

const Loading = ({className}) => {
    return (
        <div className={`spinner text-center my-4 m-auto ${className}`}>
            <Spinner size={"xl"} color="primary" />
        </div>
    );
};

export default Loading;
