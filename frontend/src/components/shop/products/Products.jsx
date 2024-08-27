import React, { useState, useEffect } from "react";
import { Table } from "flowbite-react";
import Loading from "../../groups/Loading";
import ViewGroup from "../../groups/ViewGroup";
import TableGroup from "../../groups/TableGroup";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../../groups/TablePagination";
import endpoints from "../../../config/config";
import ProductsForm from "./ProductsForm";
import { fetch_list_data } from "../../../config/actions";
import ConfirmDelete from "../../groups/ConfirmDelete";
import ErrorGroup from "../../groups/ErrorGroup";
import { usePermission } from "../../../providers/PermissionProvider";
import { useDrawer } from "../../../providers/DrawerProvider";
import StockForm from "./StockForm";

const Products = ({ stock }) => {
    //////////////////////////////// providers ////////////////////////////////
    const { showDrawer, closeDrawer } = useDrawer();
    const { set_page_permissions } = usePermission();

    //////////////////////////////// permissions ////////////////////////////////
    const permissions = set_page_permissions("shop", "product");
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
                "تعديل منتج",
                MdEdit,
                <ProductsForm
                    postURL={item.url}
                    defaultValues={item}
                    callBack={() => {
                        get_current_products();
                        closeDrawer();
                    }}
                />
            );
        } else {
            showDrawer(
                "حذف منتج",
                MdDelete,
                <>
                    <ConfirmDelete
                        deleteURL={item.url}
                        deletePrompt={" هل أنت متأكد تريد حذف المنتج"}
                        itemName={item.name}
                        closeDrawer={closeDrawer}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            get_current_products();
                        }}
                        toastMessage={"تم حذف المنتج بنجاح"}
                    />
                </>
            );
        }
    };

    const get_current_products = () => {
        const searchURL = `${endpoints.product_list}${
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
            get_current_products();
        }
    }, [searchParam, pageNumber]);

    return (
        <>
            {/* add form */}
            {!stock && (
                <>
                    {permissions.add ? (
                        <ProductsForm
                            postURL={endpoints.product_list}
                            callBack={get_current_products}
                        />
                    ) : (
                        <ErrorGroup
                            title={"إضافة منتج"}
                            message={"ليس لديك صلاحية"}
                        />
                    )}
                </>
            )}

            {stock && (
                <>
                    {permissions.change ? (
                        <StockForm callBack={get_current_products} />
                    ) : (
                        <ErrorGroup
                            title={"إضافة منتج"}
                            message={"ليس لديك صلاحية"}
                        />
                    )}
                </>
            )}

            {/* table data */}
            {permissions.view ? (
                <ViewGroup title={"المنتجات الحالية"}>
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
                                                اسم المنتج
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                سعر البيع
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                الفئة
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                المخزون
                                            </Table.HeadCell>
                                            <Table.HeadCell>
                                                إجراءات
                                            </Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body>
                                            {data.results.map((product) => {
                                                return (
                                                    <Table.Row
                                                        key={product.id}
                                                        className="bg-white font-medium text-gray-900"
                                                    >
                                                        <Table.Cell>
                                                            {product.name ? (
                                                                product.name
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {product.sell_price ? (
                                                                product.sell_price
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {product.category ? (
                                                                <span className="text-sm">
                                                                    {
                                                                        product
                                                                            .category
                                                                            ?.name
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="text-red-600">
                                                                    غير مسجل
                                                                </span>
                                                            )}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {product.stock !==
                                                            undefined ? (
                                                                <span className="text-sm">
                                                                    {
                                                                        product.stock
                                                                    }
                                                                </span>
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
                                                                                product
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
                                                                                product
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
                    title={"المنتجات الحالية"}
                    message={"ليس لديك صلاحية"}
                />
            )}
        </>
    );
};

export default Products;
