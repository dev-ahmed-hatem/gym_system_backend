import { Drawer } from "flowbite-react";
import { useEffect } from "react";

const DrawerHeader = ({ openState, title, icon, handleClose, children }) => {
    useEffect(() => {
        if (openState) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [openState]);

    return (
        <>
            <Drawer
                open={openState}
                onClose={handleClose}
                position="top"
                className="max-h-[80vh]"
            >
                <Drawer.Header title={title} titleIcon={icon} />
                <Drawer.Items>{children}</Drawer.Items>
            </Drawer>
        </>
    );
};

export default DrawerHeader;
