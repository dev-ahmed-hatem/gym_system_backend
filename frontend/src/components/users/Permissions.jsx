import React, { useEffect, useState } from "react";
import { routes } from "../../constants/Index";
import { Checkbox, Label, Button } from "flowbite-react";
import Select from "react-select";
import endpoints from "../../config/config";
import axios from "../../config/axiosconfig";
import { AiOutlineLoading } from "react-icons/ai";
import { fetch_list_data } from "../../config/actions";
import Loading from "../groups/Loading";
import { useToast } from "../../providers/ToastProvider";

const Permissions = () => {
    const is_superuser = JSON.parse(localStorage.getItem("auth_user"))[
        "is_superuser"
    ];
    if (!is_superuser) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                وحدهم المديرين يمكنهم تخصيص الصلاحيات
            </p>
        );
    }

    const { showToast } = useToast();
    const [post, setPost] = useState(false);

    const [moderatorsList, setModeratorsList] = useState(null);
    const [currentModerator, setCurrentModerator] = useState(null);
    const defaultPermissions = [
        { id: 1, value: "إضافة", name: "add" },
        { id: 2, value: "تعديل", name: "change" },
        { id: 3, value: "حذف", name: "delete" },
        { id: 4, value: "عرض", name: "view" },
    ];

    const collectSelectedPermissions = () => {
        setPost(true);
        let selected_permissions = [];
        const selected = document.querySelectorAll(
            "input[type='checkbox']:checked"
        );
        selected.forEach((check) => {
            selected_permissions.push(check.id);
        });

        const data = {
            username: currentModerator.username,
            permissions: selected_permissions,
        };

        axios
            .post(endpoints.set_permissions, data)
            .then((response) => {
                showToast("تم تعديل الصلاحيات");
                setPermissions(null);
                setCurrentModerator(null);
            })
            .catch((error) => {
                console.log(error);
                showToast("خطأ فى تنفيذ العملية", true);
            })
            .finally(() => {
                setPost(false);
            });
    };

    const fetchModerators = (search_word) => {
        const options = [];
        const url = `${endpoints.moderator_list}page_size=20&ordering=-id${
            search_word ? `&search=${search_word}` : ""
        }`;

        axios
            .get(url)
            .then((response) => {
                response.data.results.map((moderator) => {
                    options.push({
                        value: moderator.id,
                        label: moderator.employee.name,
                        username: moderator.user.username,
                    });
                });
                setModeratorsList(options);
            })
            .catch((error) => {
                setModeratorsList(null);
            });
    };

    useEffect(() => {
        fetchModerators();
    }, []);

    const [permissions, setPermissions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        // get current moderator permissions
        if (!currentModerator) return;
        setPermissions(null);
        const fetch_moderator_permissions = () => {
            const url = `${endpoints.user_permissions}username=${currentModerator.username}`;
            setLoading(true);
            fetch_list_data({
                searchURL: url,
                setLoading: setLoading,
                setFetchError: setFetchError,
                setData: setPermissions,
            });
        };

        fetch_moderator_permissions();
    }, [currentModerator]);

    return (
        <div>
            <h1 className="font-bold text-2xl text-gray-600 mt-6 mb-3">
                المشرف
            </h1>
            <div
                className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">المشرف</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>

                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="name" value="اختر مشرف :" />
                    </div>
                    <Select
                        isClearable
                        noOptionsMessage={() => "لا يوجد نتائج مطابقة"}
                        placeholder="بحث ..."
                        options={moderatorsList || []}
                        onInputChange={fetchModerators}
                        onChange={(option) => {
                            setCurrentModerator(option);
                        }}
                    ></Select>
                </div>
            </div>

            {loading && <Loading />}

            {fetchError ? (
                <p className="text-lg text-center text-red-600 py-4">
                    خطأ في تحميل البيانات
                </p>
            ) : (
                <>
                    {permissions && (
                        <div key={currentModerator.username}>
                            <h1 className="font-bold text-2xl text-gray-600 mb-3">
                                الصلاحيات
                            </h1>

                            {routes.map((route) => {
                                if (route.permissions == "unadjustable") {
                                    return;
                                }
                                return (
                                    <div
                                        className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
                                        key={route.id}
                                    >
                                        <h1 className="font-bold text-text text-lg">
                                            {route.title}
                                        </h1>
                                        <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                                        <div className="permission-groups flex gap-x-32 gap-y-10 flex-wrap">
                                            {route.permissions instanceof
                                            Array ? (
                                                <div key={route.id}>
                                                    {route.permissions.map(
                                                        (permission) => (
                                                            <div
                                                                key={
                                                                    permission.id
                                                                }
                                                                className="ps-5 lg:ps-7 mb-1 text-base"
                                                            >
                                                                <Checkbox
                                                                    id={
                                                                        permission.name
                                                                    }
                                                                    className="me-2"
                                                                    color={
                                                                        "yellow"
                                                                    }
                                                                    defaultChecked={permissions.includes(
                                                                        permission.name
                                                                    )}
                                                                />
                                                                <Label
                                                                    htmlFor={
                                                                        permission.name
                                                                    }
                                                                    className="text-base"
                                                                >
                                                                    {
                                                                        permission.value
                                                                    }
                                                                </Label>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                <>
                                                    {route.children.map(
                                                        (subRoute) => {
                                                            if (
                                                                subRoute.permissions ==
                                                                "unadjustable"
                                                            ) {
                                                                return;
                                                            }
                                                            return (
                                                                <div
                                                                    className="checkbox-group"
                                                                    key={
                                                                        subRoute.id
                                                                    }
                                                                >
                                                                    <div className="font-bold mb-2">
                                                                        {subRoute.permission_name ??
                                                                            subRoute.title}
                                                                    </div>
                                                                    {subRoute.permissions !=
                                                                    null ? (
                                                                        <>
                                                                            {subRoute.permissions.map(
                                                                                (
                                                                                    permission
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            permission.id
                                                                                        }
                                                                                        className="ps-5 lg:ps-7 mb-1 text-base"
                                                                                    >
                                                                                        <Checkbox
                                                                                            id={
                                                                                                permission.name
                                                                                            }
                                                                                            className="me-2"
                                                                                            color={
                                                                                                "yellow"
                                                                                            }
                                                                                            defaultChecked={permissions.includes(
                                                                                                permission.name
                                                                                            )}
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor={
                                                                                                permission.name
                                                                                            }
                                                                                            className="text-base"
                                                                                        >
                                                                                            {
                                                                                                permission.value
                                                                                            }
                                                                                        </Label>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {defaultPermissions.map(
                                                                                (
                                                                                    permission
                                                                                ) => (
                                                                                    <div
                                                                                        key={
                                                                                            permission.id
                                                                                        }
                                                                                        className="ps-5 lg:ps-7 mb-1 text-base"
                                                                                    >
                                                                                        <Checkbox
                                                                                            id={`${subRoute.app_label}.${permission.name}_${subRoute.model_name}`}
                                                                                            className="me-2"
                                                                                            color={
                                                                                                "yellow"
                                                                                            }
                                                                                            defaultChecked={permissions.includes(
                                                                                                `${subRoute.app_label}.${permission.name}_${subRoute.model_name}`
                                                                                            )}
                                                                                        />
                                                                                        <Label
                                                                                            htmlFor={`${subRoute.app_label}.${permission.name}_${subRoute.model_name}`}
                                                                                            className="text-base"
                                                                                        >
                                                                                            {
                                                                                                permission.value
                                                                                            }
                                                                                        </Label>
                                                                                    </div>
                                                                                )
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                                <Button
                                    onClick={collectSelectedPermissions}
                                    color={"primary"}
                                    disabled={post}
                                    className="w-32 h-10 flex justify-center items-center"
                                    size={"xl"}
                                    isProcessing={post}
                                    processingSpinner={
                                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                    }
                                >
                                    حفظ
                                </Button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Permissions;
