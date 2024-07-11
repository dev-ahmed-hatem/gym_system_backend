import React from "react";
import { Flowbite, theme, Pagination } from "flowbite-react";

theme.pagination.base += "font-bold";
theme.pagination.pages.next.base =
    "rounded-l-lg border border-gray-300 bg-white px-3 py-2 leading-tight enabled:hover:border-primary enabled:hover:text-primary";
theme.pagination.pages.previous.base =
    "ml-0 rounded-r-lg border border-gray-300 bg-white px-3 py-2 leading-tight enabled:hover:border-primary enabled:hover:text-primary";
theme.pagination.pages.selector.active =
    "bg-primary text-white hover:bg-primary hover:text-white font-bold";
theme.pagination.pages.selector.base =
    "w-12 border border-gray-300 bg-white py-2 leading-tight text-gray-500 hover:border-primary hover:text-primary";

const TablePagination = ({currentPage, totalPages, onPageChange}) => {
    return (
        <Flowbite theme={{ theme: theme }}>
            {/* Pagination */}
            <div className="flex overflow-x-auto sm:justify-center">
                <Pagination
                    className={`py-5`}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                    // showIcons
                    nextLabel=" التالى >"
                    previousLabel="< السابق"
                />
            </div>
        </Flowbite>
    );
};

export default TablePagination;
