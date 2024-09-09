import { theme } from "flowbite-react";
import { SlCalculator } from "react-icons/sl";

// Pagination
theme.pagination.base += "font-bold";
theme.pagination.pages.next.base =
    "w-15 h-10 rounded-l-lg border border-gray-300 bg-white lg:px-3 lg:py-2 text-sm lg:text-base leading-tight enabled:hover:border-primary enabled:hover:text-primary";
theme.pagination.pages.previous.base =
    "ml-0 w-15 h-10 rounded-r-lg border border-gray-300 bg-white lg:px-3 lg:py-2 text-sm lg:text-base leading-tight enabled:hover:border-primary enabled:hover:text-primary";
theme.pagination.pages.selector.active =
    "bg-primary text-white hover:bg-primary hover:text-white font-bold";
theme.pagination.pages.selector.base =
    "w-12 border border-gray-300 bg-white py-2 leading-tight text-gray-500 hover:border-primary hover:text-primary";

//  Table
theme.table.head.cell.base += " font-bold text-md lg:text-base text-black";
theme.table.row.striped = "odd:bg-primary-200 even:bg-primary-50 font-light";
theme.table.body.cell.base =
    "px-3 lg:px-6 py-3 lg:py-4 group-first/body:group-first/row:first:rounded-tr-lg group-first/body:group-first/row:last:rounded-tl-lg group-last/body:group-last/row:first:rounded-br-lg group-last/body:group-last/row:last:rounded-bl-lg text-black";

// Drawer
theme.drawer.root.position.top.on = `right-1/2 top-1/2 w-full max-w-[90%] lg:max-w-7xl translate-x-1/2 -translate-y-1/2 overflow-y-auto overflow-x-hidden lg:rounded-gl`;
theme.drawer.root.position.top.off = `right-1/2 -top-full w-full max-w-[90%] lg:max-w-7xl translate-x-1/2 -translate-y-full overflow-y-auto overflow-x-hidden lg:rounded-lg`;

// Spinner
theme.spinner.color.primary = "fill-primary";

// TextInput
theme.textInput.field.input.colors = {
    ...theme.textInput.field.input.colors,
    primary:
        "border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary",
};

// Button
theme.button.color = {
    ...theme.button.color,
    primary: "bg-primary hover:bg-primary-500 text-white",
    accent: "bg-accent hover:bg-accent-500 text-white",
    green: "bg-green-500 hover:bg-green-700 text-white",
};

theme.button.size.xl = "px-4 py-2 text-base min-w-36 h-10 flex justify-center items-center";

// ToggleSwitch
theme.toggleSwitch.toggle.base =
    "relative rounded-full border after:absolute after:rounded-full after:bg-white after:transition-all group-focus:ring-4 group-focus:ring-primary-300";
theme.toggleSwitch.toggle.checked.color.primary =
    "border-brimary-400 bg-primary";

theme.radio.root.base =
    "h-4 w-4 border border-primary-300 text-primary-600 focus:ring-2 focus:ring-primary-500";

// Checkbox
theme.checkbox.root.base =
    "h-5 w-5 rounded border border-gray-300 bg-gray-100 focus:ring-2 dark:border-gray-600 dark:bg-gray-700";

// DatePicker
theme.datepicker = {
    ...theme.datepicker,
    root: {
        base: "relative",
    },
    popup: {
        root: {
            base: "absolute top-10 z-50 block pt-2",
            inline: "relative top-0 z-auto",
            inner: "inline-block rounded-lg bg-white p-4 shadow-lg dark:bg-gray-700",
        },
        header: {
            base: "",
            title: "px-2 py-3 text-center font-semibold text-gray-900 dark:text-white",
            selectors: {
                base: "mb-2 flex justify-between flex-row-reverse", ///////
                button: {
                    base: "rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
                    prev: "",
                    next: "",
                    view: "",
                },
            },
        },
        view: {
            base: "p-1",
        },
        footer: {
            base: "mt-2 flex space-x-2",
            button: {
                base: "w-full rounded-lg px-5 py-2 text-center text-sm font-medium focus:ring-4 focus:ring-primary-300", ////
                today: "bg-primary-700 text-white hover:bg-primary-800 ", ////
                clear: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600",
            },
        },
    },
    views: {
        days: {
            header: {
                base: "mb-1 grid grid-cols-7",
                title: "h-6 text-center text-sm font-medium leading-6 text-gray-500 dark:text-gray-400",
            },
            items: {
                base: "grid w-full grid-cols-7", ///////
                item: {
                    base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                    selected: "bg-primary-700 text-white hover:bg-primary-600", /////
                    disabled: "text-gray-500",
                },
            },
        },
        months: {
            items: {
                base: "grid w-64 grid-cols-4",
                item: {
                    base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                    selected: "bg-primary-700 text-white hover:bg-primary-600", /////
                    disabled: "text-gray-500",
                },
            },
        },
        years: {
            items: {
                base: "grid w-64 grid-cols-4",
                item: {
                    base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                    selected: "bg-primary-700 text-white hover:bg-primary-600", //////
                    disabled: "text-gray-500",
                },
            },
        },
        decades: {
            items: {
                base: "grid w-64 grid-cols-4",
                item: {
                    base: "block flex-1 cursor-pointer rounded-lg border-0 text-center text-sm font-semibold leading-9 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-600",
                    selected: "bg-primary-700 text-white hover:bg-primary-600", /////
                    disabled: "text-gray-500",
                },
            },
        },
    },
};

export default theme;
