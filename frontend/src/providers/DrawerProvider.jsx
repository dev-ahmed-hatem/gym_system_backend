import { Drawer } from "flowbite-react";
import { useState, useEffect, useContext, createContext } from "react";

const DrawerContext = createContext();

const DrawerProvider = ({ children }) => {
    const [drawerState, setDrawerState] = useState({
        open: false,
        title: null,
        icon: null,
        content: null,
    });

    useEffect(() => {
        if (drawerState.open) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
    }, [open]);

    const showDrawer = (title, icon, content) => {
        setDrawerState({
            open: true,
            title: title,
            icon: icon,
            content: content,
        });
    };

    const closeDrawer = () => {
        setDrawerState({ open: false, title: null, icon: null, content: null });
    };

    return (
        <DrawerContext.Provider value={{ showDrawer, closeDrawer }}>
            {drawerState.open && (
                <Drawer
                    open={drawerState.open}
                    onClose={closeDrawer}
                    position="top"
                    className="max-h-[80vh]"
                >
                    <Drawer.Header
                        title={drawerState.title}
                        titleIcon={drawerState.icon}
                    />
                    <Drawer.Items>{drawerState.content}</Drawer.Items>
                </Drawer>
            )}
            {children}
        </DrawerContext.Provider>
    );
};

export const useDrawer = () => useContext(DrawerContext);

export default DrawerProvider;
