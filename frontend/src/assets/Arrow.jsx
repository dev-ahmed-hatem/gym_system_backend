import React from "react";

const Arrow = ({ className }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3"
            stroke="currentColor"
            aria-hidden="true"
            className={`w-5 h-3 ${className}`}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="rotate(90 12 12)"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
            ></path>
        </svg>
    );
};

export default Arrow;
