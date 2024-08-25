import SalariesForm from "./SalariesForm";
import { usePermission } from "../../../providers/PermissionProvider";

const Salaries = () => {
    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("financials", "salary");
    if (!permissions.change) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }

    return (
        <>
            {/* edit salary form */}
            <SalariesForm />
        </>
    );
};

export default Salaries;
