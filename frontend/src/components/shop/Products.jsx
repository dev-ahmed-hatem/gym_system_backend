import React, { useState, useEffect } from "react";
import FormGroup from "../groups/FormGroup";
import {
    TextInput,
    Label,
    Table,
    Button,
    Select,
    Textarea,
} from "flowbite-react";
import Loading from "../groups/Loading";
import axios from "axios";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import { useForm } from "react-hook-form";
import Notification from "../groups/Notification";
import {
    MdEdit,
    MdDelete,
    MdOutlineDriveFileRenameOutline,
    MdInventory,
} from "react-icons/md";
import DrawerHeader from "../groups/DrawerHeader";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../../config";
import { FaMoneyBill } from "react-icons/fa";

const ProductsForm = ({ setToast, postURL, defaultValues, callBack }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [post, setPost] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        reset,
    } = useForm({
        defaultValues: defaultValues
            ? { ...defaultValues, category: defaultValues?.category?.id }
            : null,
    });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.patch;
    const [categories, setCategories] = useState(null); 

    const fetchCategories = () => {
        axios
            .get(`${endpoints.product_category_list}page_size=100`)
            .then((response) => {
                setCategories(response.data.results);
            })
            .catch((error) => {
                console.log(error);
                setFetchError(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const onSubmit = (data) => {
        setPost(true);
        data = {
            ...data,
            price: Number(data.price),
            category: Number(data.category),
            stock: Number(data.stock),
        };
        // console.log(data);
        // return;

        requestMethod(postURL, data)
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? "تم إضافة منتج جديد"
                        : "تم تعديل المنتج"
                );
                reset();
                callBack();
            })
            .catch((error) => {
                console.log(error);
                if (error.response && error.response.data) {
                    const serverErrors = error.response.data;
                    for (let field in serverErrors) {
                        const message =
                            serverErrors[field][0].search("exists") == -1
                                ? "قيمة غير صالحة"
                                : "القيمة موجودة سابقا";
                        setError(field, {
                            type: "server",
                            message: message,
                        });
                    }
                }
                setPost(false);
            });
    };
    return (
        <FormGroup
            onSubmit={handleSubmit(onSubmit)}
            title={formFunction == "add" ? "إضافة منتج" : "تعديل منتج"}
            formFunction={formFunction}
            post={post}
        >
            {isLoading ? (
                <Loading className={`w-full text-center`} />
            ) : fetchError ? (
                <p className="text-lg text-center text-red-600 py-4 w-full m-auto">
                    خطأ في تحميل البيانات
                </p>
            ) : (
                <>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="name" value="اسم المنتج :" />
                        </div>
                        <TextInput
                            id="name"
                            type="text"
                            rightIcon={MdOutlineDriveFileRenameOutline}
                            placeholder="اسم المنتج"
                            color={errors.name ? "failure" : "primary"}
                            {...register("name", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("name")}
                        />

                        {errors.name && (
                            <p className="error-message">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="price" value="السعر :" />
                        </div>
                        <TextInput
                            id="price"
                            type="number"
                            rightIcon={FaMoneyBill}
                            placeholder="السعر"
                            color={errors.price ? "failure" : "primary"}
                            {...register("price", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("price")}
                        />
                        {errors.price && (
                            <p className="error-message">
                                {errors.price.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="stock" value="المخزون :" />
                        </div>
                        <TextInput
                            id="stock"
                            type="number"
                            rightIcon={MdInventory}
                            placeholder="المخزون"
                            color={errors.stock ? "failure" : "primary"}
                            defaultValue={0}
                            {...register("stock", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("stock")}
                        />
                        {errors.stock && (
                            <p className="error-message">
                                {errors.stock.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="category" value="الفئة :" />
                        </div>
                        <Select
                            id="category"
                            type="select"
                            placeholder="الفئة"
                            color={errors.category ? "failure" : "primary"}
                            {...register("category", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("category")}
                        >
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                        {errors.category && (
                            <p className="error-message">
                                {errors.category.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="description" value="إضافة وصف :" />
                        </div>
                        <Textarea
                            id="description"
                            placeholder="وصف"
                            color={"primary"}
                            {...register("description", {})}
                            rows={3}
                        />

                        {errors.description && (
                            <p className="error-message">
                                {errors.description.message}
                            </p>
                        )}
                    </div>
                </>
            )}
        </FormGroup>
    );
};

const ConfirmDelete = ({ subscription, closeDrawer, setToast, callBack }) => {
    const [post, setPost] = useState(false);

    const deleteManager = () => {
        setPost(true);
        axios
            .delete(subscription.url)
            .then(() => {
                setToast("تم حذف المنتج بنجاح");
                callBack();
                closeDrawer();
            })
            .catch((error) => {
                setPost(false);
            });
    };

    return (
        <div
            className={`wrapper p-4 my-2 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <p className="text-base">
                هل أنت متأكد تريد حذف المنتج:{" "}
                <span className="font-bold text-red-600">
                    {subscription.name}
                </span>
            </p>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                <Button
                    type="button"
                    color={"blue"}
                    className="me-4"
                    disabled={post}
                    onClick={closeDrawer}
                >
                    إلغاء
                </Button>
                <Button
                    type="button"
                    color={"failure"}
                    disabled={post}
                    onClick={deleteManager}
                >
                    حذف
                </Button>
            </div>
        </div>
    );
};

const Products = () => {
    //////////////////////////////// form settings ////////////////////////////////

    //////////////////////////////// drawer settings ////////////////////////////////
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState(null);

    //////////////////////////////// list data ////////////////////////////////
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const showDrawer = (drawerFunction, subscription) => {
        if (drawerFunction == "edit") {
            setDrawerData({
                title: "تعديل منتج",
                icon: MdEdit,
                content: (
                    <ProductsForm
                        setToast={setToast}
                        postURL={subscription.url}
                        defaultValues={subscription}
                        callBack={() => {
                            fetchListData();
                            closeDrawer();
                        }}
                    />
                ),
            });
        } else {
            setDrawerData({
                title: "حذف منتج",
                icon: MdDelete,
                content: (
                    <ConfirmDelete
                        subscription={subscription}
                        closeDrawer={closeDrawer}
                        setToast={setToast}
                        callBack={() => {
                            setSearchParam(null);
                            setPageNumber(null);
                            fetchListData();
                        }}
                    />
                ),
            });
        }
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerData(null);
        setDrawerOpen(false);
    };

    const changePage = (page) => {
        setPageNumber(page);
    };

    const fetchListData = () => {
        const searchURL = `${endpoints.product_list}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}
        `;
        axios
            .get(searchURL)
            .then((response) => {
                setData(response.data);
                setLoading(false);
            })
            .catch((fetchError) => {
                setFetchError(fetchError);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchListData();
    }, [searchParam, pageNumber]);

    return (
        <>
            {/*  notification */}
            {toast && <Notification setToast={setToast} title={toast} />}

            {/* drawer */}
            {{ drawerOpen } && (
                <DrawerHeader
                    title={drawerData?.title}
                    openState={drawerOpen}
                    setOpenState={setDrawerOpen}
                    icon={drawerData?.icon}
                    handleClose={closeDrawer}
                >
                    {drawerData?.content}
                </DrawerHeader>
            )}

            {/* add form */}
            <ProductsForm
                setToast={setToast}
                postURL={endpoints.product_list}
                callBack={fetchListData}
            />

            {/* table data */}
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
                                        <Table.Cell>لا توجد بيانات</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ) : (
                                <>
                                    <Table.Head>
                                        <Table.HeadCell>
                                            اسم المنتج
                                        </Table.HeadCell>
                                        <Table.HeadCell>السعر</Table.HeadCell>
                                        <Table.HeadCell>الفئة</Table.HeadCell>
                                        <Table.HeadCell>المخزون</Table.HeadCell>
                                        <Table.HeadCell>إجراءات</Table.HeadCell>
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
                                                        {product.price ? (
                                                            product.price
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
                                                        {product.stock ? (
                                                            <span className="text-sm">
                                                                {product.stock}
                                                            </span>
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        <span className="flex text-xl gap-x-3">
                                                            <MdEdit
                                                                className="text-accent cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "edit",
                                                                        product
                                                                    );
                                                                }}
                                                            />
                                                            <MdDelete
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "delete",
                                                                        product
                                                                    );
                                                                }}
                                                            />
                                                        </span>
                                                    </Table.Cell>
                                                </Table.Row>
                                            );
                                        })}
                                    </Table.Body>
                                </>
                            )}
                        </TableGroup>

                        {data.total_pages > 1 ? (
                            <TablePagination
                                totalPages={data.total_pages}
                                currentPage={data.current_page}
                                onPageChange={changePage}
                            />
                        ) : (
                            <></>
                        )}
                    </>
                )}
            </ViewGroup>
        </>
    );
};

export default Products;
