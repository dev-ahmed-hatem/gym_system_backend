import { useNavigate } from "react-router-dom";

const UserIcon = ({ gymData, className }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("auth_user"));

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("auth_user");

        navigate("/login");
    };

    return (
        <div
            className={`flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse relative ${
                className ?? ""
            }`}
            id="user-icon"
        >
            <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full w-11 h-11 md:me-0 focus:ring-4
                 focus:ring-white overflow-hidden"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
            >
                <img
                    className="w-full h-full"
                    src={gymData?.logo}
                    alt="صورة المستخدم"
                />
            </button>
            <div
                className="z-50 my-4 text-base list-none bg-accent divide-y divide-gray-100 rounded-lg
                 shadow dark:divide-gray-600 absolute top-7 start-1/2 translate-x-[70%] lg:translate-x-1/2 w-44"
                id="user-dropdown"
            >
                <div className="px-4 py-3">
                    <span className="block text-m text-text font-bold">
                        {user?.username ?? user.user?.username}
                    </span>
                    <span className="block text-sm  text-text">
                        {user?.is_superuser ? "مدير" : "مشرف"}
                    </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                    <li>
                        <span
                            onClick={logout}
                            className="block px-4 py-2 text-sm text-black hover:bg-white cursor-pointer"
                        >
                            تسجيل خروج
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default UserIcon;
