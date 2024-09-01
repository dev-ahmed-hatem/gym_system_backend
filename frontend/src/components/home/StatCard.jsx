import React from "react";

const StatCard = ({ title, value, icon }) => {
    return (
        <div
            className="bg-primary rounded text-white shadow-2xl min-h-36 w-[46%] md:w-[270px] lg:w-72 flex py-6 md:py-7 px-4 justify-between items-center
          flex-col-reverse md:flex-row max-sm:text-center max-md:gap-y-3 border-t-8 border-t-accent"
        >
            <div className="data md:text-right text-center text-lg md:text-[18px] w-full">
                <p className="mb-2">{title}</p>
                <p className="text-accent font-bold">{value}</p>
            </div>
            <div className="icon text-3xl lg:text-4xl rounded-full border-2 md:border-[3px] lg:border-4 border-white p-3">
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
