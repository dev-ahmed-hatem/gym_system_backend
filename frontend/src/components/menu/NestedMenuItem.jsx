import React from "react";
import { useLocation } from "react-router-dom";
import Arrow from "../../assets/Arrow";
import SingleMenuItem from "./SingleMenuItem";
import { useState, useRef } from "react";

const NestedMenuItem = ({ item, setMenuState }) => {
    const itemRef = useRef(null);
    const location = useLocation();
    const currentDisplay = location.pathname.startsWith(item.url);
    const [active, setActive] = useState(!currentDisplay);

    const changeDropDown = (dropDown) => {
        if (active) {
            dropDown.style.height = dropDown.scrollHeight + "px";
            dropDown.style.paddingBottom = "12px";
        } else {
            dropDown.style.height = "0px";
            dropDown.style.paddingBottom = "0px";
        }
    };

    const toggle = function () {
        const dropDown =
            itemRef.current.parentElement.querySelector(".drop-down");

        changeDropDown(dropDown);

        setActive(!active);
    };

    return (
        <div className="relative block w-full cursor-pointer active">
            <div
                className={`flex w-full justify-between items-center ${
                    currentDisplay ? "bg-primary text-white" : ""
                }  px-2 lg:px-4 hover:bg-primary h-10 rounded`}
                ref={itemRef}
                onClick={toggle}
            >
                <div className={`flex items-center`}>
                    <span className="me-2 lg:me-4">{item.icon}</span>
                    <div className="font-bold">{item.title}</div>
                </div>
                <Arrow className={`${active ? "rotate-90" : ""}`} />
            </div>

            <div
                className={`drop-down ${
                    currentDisplay ? "" : "h-0"
                } pb overflow-hidden`}
            >
                {item.children.map((item) => (
                    <SingleMenuItem
                        item={item}
                        setMenuState={setMenuState}
                        key={item.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default NestedMenuItem;
