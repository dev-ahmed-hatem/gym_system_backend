import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import OffersForm from "./OffersForm";
import { fetch_list_data } from "../../../config/actions";
import ConfirmDelete from "../../groups/ConfirmDelete";
import ErrorGroup from "../../groups/ErrorGroup";
import { usePermission } from "../../../providers/PermissionProvider";
import { useDrawer } from "../../../providers/DrawerProvider";

const Offers = () => {
    //////////////////////////////// form settings ////////////////////////////////
    const [currentSetting, setCurrentSetting] = useState({
        name: "الجنسية",
        list_url: endpoints.nationality_list,
    });

    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions("shop", "offer");
    if (!permissions.add && !permissions.view) {
        return (
            <p className="text-lg text-center text-red-600 py-4">
                ليس لديك صلاحيات هنا
            </p>
        );
    }

    //////////////////////////////// list data ////////////////////////////////
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const handleDrawer = (drawerFunction, item) => {
        if (drawerFunction == "edit") {
            showDrawer(
                "تعديل بند",
                MdEdit,
                <OffersForm
                    postURL={item.url}
                    defaultValues={item}
                    callBack={() => {
                        get_current_offers();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف بند",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={" هل أنت متأكد تريد حذف العرض"}
                        itemName={item.name}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            get_current_offers();
                        }}
                        toastMessage={"تم حذف العرض بنجاح"}
                    />
                </>
            );
        }
    };

    const get_current_offers = () => {
        const searchURL = `${endpoints.offer_list}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}
        `;

        fetch_list_data({
            searchURL: searchURL,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: setLoading,
        });
    };

    useEffect(() => {
        if (permissions.view) {
            get_current_offers();
        }
    }, [searchParam, pageNumber, currentSetting]);

    return (
        <>
            {/* add form */}
            {permissions.add ? (
                <OffersForm
                    postURL={endpoints.offer_list}
                    callBack={get_current_offers}
                />
            ) : (
                <ErrorGroup title={"إضافة عرض"} message={"ليس لديك صلاحية"} />
            )}

            {/* table data */}
            {permissions.view ? (
                <ViewGroup title={`العروض الحالية`}>
                    {loading ? (
                        <Loading />
                    ) : fetchError ? (
                        <p className="text-lg text-center text-red-600 py-4">
                            خطأ في تحميل البيانات
                        </p>
                    ) : (
                        <>
                            <TableGroup
                                onChange={(event) => {
                                    setSearchParam(event.target.value);
                                    setPageNumber(1);
                                }}
                            >
                                {data.count == 0 ? (
                                    <Table.Body>
                                        <Table.Row className="text-lg text-center text-gray-800 py-3 font-bold bg-red-500">
                                            <Table.Cell>
                                                لا توجد بيانات
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                ) : (
                                    <>
                                        <Table.Head>
                                            <Table.HeadCell>
                                                نوع العرض
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                العنصر
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                نسبة الخصم
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                البداية
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                النهاية
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                إجراءات
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((offer) => {
                                                return (
                                                    <Table.Row
                                                        key={offer.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {offer.offer_type_display ? (
                                                                offer.offer_type_display
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {offer.offer_type ==
                                                            "product"
                                                                ? offer.product
                                                                      .name
                                                                : offer.plan
                                                                      .name}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {offer.percentage ? (
                                                                offer.percentage
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {offer.start_date ? (
                                                                offer.start_date
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {offer.end_date ? (
                                                                offer.end_date
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
                                                                                offer
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
                                                                                offer
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
                                    </>
                                )}
                            </TableGroup>

                            {data.total_pages > 1 && (
                                <TablePagination
                                    totalPages={data.total_pages}
                                    currentPage={data.current_page}
                                    onPageChange={(page) => {
                                        setPageNumber(page);
                                    }}
                                />
                            )}
                        </>
                    )}
                </ViewGroup>
            ) : (
                <ErrorGroup
                    title={"العروض الحالية"}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default Offers;
