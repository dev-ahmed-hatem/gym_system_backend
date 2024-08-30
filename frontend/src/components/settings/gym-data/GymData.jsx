import React, { useState, useEffect } from "react";
import { get_gym_data } from "../../../config/actions";
import { Table, Button } from "flowbite-react";
import ConfirmDelete from "../../groups/ConfirmDelete";
import { usePermission } from "../../../providers/PermissionProvider";
import { useDrawer } from "../../../providers/DrawerProvider";
import { MdDelete, MdEdit } from "react-icons/md";
import GymDataForm from "./GymDataForm";
import Loading from "../../groups/Loading";
import LinksForm from "./LinksForm";
import endpoints from "../../../config/config";

const GymData = () => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions("gym_data", "gymdata");
    if (!permissions.change) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }
    const [gymData, setGymData] = useState(null);
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    const get_current_gym_data = () => {
        get_gym_data()
            .then(({ gym_data, links }) => {
                setGymData(gym_data);
                setLinks(links);
            })
            .catch((error) => {
                setFetchError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        get_current_gym_data();
    }, []);

    const edit_gym_data = () => {
        showDrawer(
            "تعديل بيانات الجيم",
            MdEdit,
            <GymDataForm
                gymData={gymData}
                callBack={() => {
                    get_current_gym_data();
                    closeDrawer();
                }}
            />
        );
    };

    const handleDrawer = (drawerFunction, item) => {
        if (drawerFunction == "edit") {
            showDrawer(
                "تعديل رابط",
                MdEdit,
                <LinksForm
                    postURL={item.api_url}
                    defaultValues={item}
                    callBack={() => {
                        get_current_gym_data();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف رابط",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.api_url}
                        deletePrompt={" هل أنت متأكد تريد حذف الرابط"}
                        itemName={item.title}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            get_current_gym_data();
                        }}
                        toastMessage={"تم حذف الرابط بنجاح"}
                    />
                </>
            );
        }
    };

    if (loading) {
        return (
            <div
                className={`client-data p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">بيانات الجيم</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <Loading />
            </div>
        );
    }

    if (fetchError) {
        return (
            <div
                className={`client-data p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">بيانات الجيم</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <p className="text-lg text-center text-red-600 py-4">
                    خطأ في تحميل البيانات
                </p>
            </div>
        );
    }

    return (
        <>
            {/* Gym Data */}
            <div
                className={`client-data p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">بيانات الجيم</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <div className="table-wrapper overflow-x-auto">
                    <Table className="text-right text-lg">
                        <Table.Body>
                            {/* photo */}
                            <Table.Row>
                                <Table.Cell>
                                    <span className="me-3">الصورة : </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span>
                                        {gymData?.logo ? (
                                            <img
                                                src={gymData.logo}
                                                className="w-72"
                                            />
                                        ) : (
                                            <span className="text-secondary">
                                                لا توجد صورة حالية
                                            </span>
                                        )}
                                    </span>
                                </Table.Cell>
                            </Table.Row>
                            {/* title */}
                            <Table.Row>
                                <Table.Cell>
                                    <span className="me-3">اسم الجيم : </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span>
                                        {gymData?.title ? (
                                            <span>{gymData.title}</span>
                                        ) : (
                                            <span className="text-secondary">
                                                غير مسجل
                                            </span>
                                        )}
                                    </span>
                                </Table.Cell>
                            </Table.Row>
                            {/* address */}
                            <Table.Row>
                                <Table.Cell>
                                    <span className="me-3">العنوان : </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span>
                                        {gymData?.address ? (
                                            <span>{gymData.address}</span>
                                        ) : (
                                            <span className="text-secondary">
                                                غير مسجل
                                            </span>
                                        )}
                                    </span>
                                </Table.Cell>
                            </Table.Row>
                            {/* phone */}
                            <Table.Row>
                                <Table.Cell>
                                    <span className="me-3">رقم التواصل : </span>
                                </Table.Cell>
                                <Table.Cell>
                                    <span>
                                        {gymData?.telephone ? (
                                            <span>{gymData.telephone}</span>
                                        ) : (
                                            <span className="text-secondary">
                                                غير مسجل
                                            </span>
                                        )}
                                    </span>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </div>

                <div className="flex flex-wrap max-h-12 min-w-full justify-center mt-10">
                    <Button
                        color={"accent"}
                        className="w-32 h-10 flex justify-center items-center"
                        size={"xl"}
                        onClick={edit_gym_data}
                    >
                        تعديل
                    </Button>
                </div>
            </div>

            {/* Add Link Form */}
            <LinksForm
                postURL={endpoints.link_list}
                callBack={get_current_gym_data}
            />

            {/* Gym Links */}
            <div
                className={`client-data p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
            >
                <h1 className="font-bold text-text text-lg">الروابط</h1>
                <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                <div className="table-wrapper overflow-x-auto">
                    <Table className="text-right text-lg">
                        <Table.Head>
                            <Table.HeadCell>الأيقون</Table.HeadCell>
                            <Table.HeadCell>الاسم</Table.HeadCell>
                            <Table.HeadCell>الرابط</Table.HeadCell>
                            <Table.HeadCell>إجراءات</Table.HeadCell>
                        </Table.Head>
                        <Table.Body>
                            {links?.map((link) => {
                                return (
                                    <Table.Row
                                        key={link.id}
                                        className="bg-white font-medium text-gray-900"
                                    >
                                        <Table.Cell>
                                            {link.icon ? (
                                                <img
                                                    src={link.icon}
                                                    className="w-8"
                                                />
                                            ) : (
                                                <span className="text-red-600">
                                                    غير مسجل
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {link.title ? (
                                                link.title
                                            ) : (
                                                <span className="text-red-600">
                                                    غير مسجل
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {link.url ? (
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    className="underline"
                                                    dir="ltr"
                                                >
                                                    {link.url}
                                                </a>
                                            ) : (
                                                <span className="text-red-600">
                                                    غير مسجل
                                                </span>
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <span className="flex text-xl gap-x-3">
                                                {permissions.change && (
                                                    <MdEdit
                                                        className="text-accent cursor-pointer"
                                                        onClick={() => {
                                                            handleDrawer(
                                                                "edit",
                                                                link
                                                            );
                                                        }}
                                                    />
                                                )}
                                                {permissions.delete && (
                                                    <MdDelete
                                                        className="text-secondary cursor-pointer"
                                                        onClick={() => {
                                                            handleDrawer(
                                                                "delete",
                                                                link
                                                            );
                                                        }}
                                                    />
                                                )}
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                );
                            })}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default GymData;
