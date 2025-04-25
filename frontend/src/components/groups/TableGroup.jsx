import React from "react";
import { Table } from "flowbite-react";
import SearchField from "./SearchField";

const TableGroup = ({ onChange, children, searchField=true }) => {
    return (
        <>
            {searchField && <SearchField onChange={onChange} />}
            <div className="table-wrapper w-full overflow-x-auto">
                <Table striped className="font-bold text-right">
                    {children}
                </Table>
            </div>
        </>
    );
};

export default TableGroup;
