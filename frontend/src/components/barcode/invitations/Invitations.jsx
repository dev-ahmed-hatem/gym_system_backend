import React from "react";
import { usePermission } from "../../../providers/PermissionProvider";
import ClientSubscriptions from "./ClientSubscriptions";
import ErrorGroup from "../../groups/ErrorGroup";
import AddInvitation from "./AddInvitation";

const Invitations = () => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("subscriptions", "invitation");

    if (!permissions.add)
        return <ErrorGroup title={"إنشاء دعوة"} message={"ليس لديك صلاحية"} />;

    return (
        <>
            <ClientSubscriptions />
            <AddInvitation />
        </>
    );
};

export default Invitations;
