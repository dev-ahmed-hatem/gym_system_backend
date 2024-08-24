import React, { useState, useEffect, createContext, useContext } from "react";
import Loading from "../components/groups/Loading";
import { fetch_list_data } from "../config/actions";
import endpoints from "../config/config";

const PermissionContext = createContext();

const PermissionProvider = ({ children }) => {
    const is_superuser = JSON.parse(localStorage.getItem("auth_user"))[
        "is_superuser"
    ];
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [permissions, setPermissions] = useState(null);

    useEffect(() => {
        fetch_list_data({
            searchURL: endpoints.user_permissions,
            setLoading: setLoading,
            setFetchError: setLoadError,
            setData: setPermissions,
        });
    }, []);

    const has_permission = (perm) => {
        if (is_superuser) return true;
        return permissions.includes(perm) ? true : false;
    };

    const set_page_permissions = (app_label, model_name) => {
        const perm_names = ["add", "view", "change", "delete"];
        const perms = {};
        perm_names.map((perm) => {
            perms[perm] = has_permission(
                `${app_label}.${perm}_${model_name}`
            );
        });
        return perms;
    };

    if (loading) return <Loading />;
    if (loadError)
        return (
            <p className="text-lg text-center text-red-600 py-4">
                خطأ في تحميل الصفحة
            </p>
        );

    return (
        <PermissionContext.Provider
            value={{ has_permission, set_page_permissions }}
        >
            {children}
        </PermissionContext.Provider>
    );
};

export const usePermission = () => useContext(PermissionContext);

export default PermissionProvider;
