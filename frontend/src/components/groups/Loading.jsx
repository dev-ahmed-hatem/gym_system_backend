import React from "react";
import { Spinner, theme, Flowbite } from "flowbite-react";

theme.spinner.color.primary = "fill-primary";

const Loading = () => {
    return (
        <Flowbite theme={{ theme: theme }}>
            <div className="spinner text-center my-4">
                <Spinner size={"xl"} color="primary" />
            </div>
        </Flowbite>
    );
};

export default Loading;
