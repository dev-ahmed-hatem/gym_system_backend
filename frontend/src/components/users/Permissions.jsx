import React, { useEffect, useState } from "react";
import { routes } from "../../constants/Index";
import { Checkbox, Label } from "flowbite-react";
import Select from "react-select";
import endpoints from "../../../config";
import axios from "axios";

const Permissions = () => {
    const [moderatorsList, setModeratorsList] = useState(null);
    const [currentModerator, setCurrentModerator] = useState(null);
    const defaultPermissions = [
        { id: 1, value: "إضافة", name: "add" },
        { id: 2, value: "تعديل", name: "change" },
        { id: 3, value: "حذف", name: "delete" },
        { id: 4, value: "عرض", name: "view" },
    ];

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

            {currentModerator && (
                <>
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
                                    {route.permissions instanceof Array ? (
                                        <div key={route.id}>
                                            {route.permissions.map(
                                                (permission) => (
                                                    <div
                                                        key={permission.id}
                                                        className="ps-5 lg:ps-7 mb-1 text-base"
                                                    >
                                                        <Checkbox
                                                            id={`${permission.name}-${route.name}`}
                                                            className="me-2"
                                                            color={"yellow"}
                                                        />
                                                        <Label
                                                            htmlFor={`${permission.name}-${route.name}`}
                                                            className="text-base"
                                                        >
                                                            {permission.value}
                                                        </Label>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {route.children.map((subRoute) => {
                                                if (
                                                    subRoute.permissions ==
                                                    "unadjustable"
                                                ) {
                                                    return;
                                                }
                                                return (
                                                    <div
                                                        className="checkbox-group"
                                                        key={subRoute.id}
                                                    >
                                                        <div className="font-bold mb-2">
                                                            {subRoute.title}
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
                                                                                id={`${permission.name}-${subRoute.name}`}
                                                                                className="me-2"
                                                                                color={
                                                                                    "yellow"
                                                                                }
                                                                            />
                                                                            <Label
                                                                                htmlFor={`${permission.name}-${subRoute.name}`}
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
                                                                                id={`${permission.name}-${subRoute.name}`}
                                                                                className="me-2"
                                                                                color={
                                                                                    "yellow"
                                                                                }
                                                                            />
                                                                            <Label
                                                                                htmlFor={`${permission.name}-${subRoute.name}`}
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
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </>
            )}
        </div>
    );
};

export default Permissions;
