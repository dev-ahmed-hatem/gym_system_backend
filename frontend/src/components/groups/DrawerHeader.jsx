import { Drawer, Flowbite, theme } from "flowbite-react";
import { useEffect } from "react";
import { MdEdit } from "react-icons/md";
import FormGroup from "./FormGroup";

// customize default theme
theme.drawer.root.position.top.on = `right-1/2 top-1/2 w-full max-w-[90%] lg:max-w-7xl translate-x-1/2 -translate-y-1/2 overflow-y-auto overflow-x-hidden lg:rounded-gl`;
theme.drawer.root.position.top.off = `right-1/2 -top-full w-full max-w-[90%] lg:max-w-7xl translate-x-1/2 -translate-y-full overflow-y-auto overflow-x-hidden lg:rounded-lg`;

const DrawerHeader = ({ openState, setOpenState, title, icon, handleClose, children }) => {

    useEffect(() => {
        if (openState) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [openState]);

    return (
        <>
            <Flowbite theme={{ theme: theme }}>
                <Drawer open={openState} onClose={handleClose} position="top" className="max-h-[80vh]">
                    <Drawer.Header title={title} titleIcon={icon} />
                    <Drawer.Items>{children}</Drawer.Items>
                </Drawer>
            </Flowbite>
        </>
    );
};

export default DrawerHeader;
