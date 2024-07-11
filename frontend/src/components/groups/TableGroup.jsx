import React from "react";
import { Flowbite, theme, Table } from "flowbite-react";
import SearchField from "./SearchField";

// Customize default theme
theme.table.head.cell.base += " font-bold text-md lg:text-base text-black";
theme.table.row.striped = "odd:bg-primary-200 even:bg-primary-50 font-light";
theme.table.body.cell.base =
    "px-6 py-4 group-first/body:group-first/row:first:rounded-tr-lg group-first/body:group-first/row:last:rounded-tl-lg group-last/body:group-last/row:first:rounded-br-lg group-last/body:group-last/row:last:rounded-bl-lg text-black";

const TableGroup = ({ onChange, children }) => {
    return (
        <Flowbite theme={{ theme: theme }}>
            <SearchField
            onChange={onChange}
            />
            <div className="table-wrapper w-full overflow-x-auto">
                <Table striped className="font-bold text-right">
                    {children}
                </Table>
            </div>
        </Flowbite>
    );
};

export default TableGroup;
