import React from "react";
import endpoints from "../../config/config";
import SubscriptionAddForm from "./SubscriptionAddForm";
import { usePermission } from "../../providers/PermissionProvider";

const SubscriptionAdd = ({ defaultValues, postURL, callBack }) => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("subscriptions", "subscription");
    if (!permissions.view) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }
    return (
        <>
            {/* add form */}
            <SubscriptionAddForm
                postURL={postURL ? postURL : endpoints.subscription_list}
                defaultValues={defaultValues}
                callBack={callBack}
            />
        </>
    );
};

export default SubscriptionAdd;
