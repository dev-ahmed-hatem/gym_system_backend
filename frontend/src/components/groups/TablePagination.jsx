import React from "react";
import { Pagination } from "flowbite-react";

const TablePagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <>
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
        </>
    );
};

export default TablePagination;
