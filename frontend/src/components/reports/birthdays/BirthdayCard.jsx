import React from "react";

const BirthdayCard = ({ client }) => {
    return (
        <div className="border-2 flex max-md:flex-col-reverse max-md:max-w-80 max-md:gap-y-5
        justify-between items-center border-primary rounded-lg w-full md:max-w-lg lg:min-w-96 p-4 relative">
            <div className="data flex flex-col gap-y-3 max-md:w-full">
                <p className="text-primary font-bold text-2xl">{client.name}</p>
                <p>
                    تاريخ الميلاد :{" "}
                    <span className="text-primary font-bold ms-2">
                        {client.birth_date}
                    </span>
                </p>
                <p>
                    العمر :{" "}
                    <span className="text-primary font-bold ms-2">
                        {client.age}
                    </span>
                </p>
                <p>
                    الكود :{" "}
                    <span className="text-primary font-bold ms-2">
                        {client.id}
                    </span>
                </p>
                <p>
                    النوع :{" "}
                    <span className="text-primary font-bold ms-2">
                        {client?.gander == "male" ? "ذكر" : "أنثى"}
                    </span>
                </p>
                <p>
                    الموبايل :{" "}
                    <span className="text-primary font-bold ms-2">
                        {client?.phone}
                    </span>
                </p>
                {client.phone2 && (
                    <p>
                        الموبايل 2 :{" "}
                        <span className="text-primary font-bold ms-2">
                            {client?.phone2}
                        </span>
                    </p>
                )}
            </div>
            {client.photo && (
                <div className="state top-5 left-8 rounded-xl overflow-hidden">
                    <img
                        src={client.photo}
                        className="w-full max-w-44 max-h-60 object-cover"
                        alt=""
                    />
                </div>
            )}
        </div>
    );
};

export default BirthdayCard;
