import React, { useState, useEffect } from "react";
import FormGroup from "../groups/FormGroup";
import {
    TextInput,
    Label,
    Table,
    Button,
    Select,
    Textarea,
    Datepicker,
} from "flowbite-react";
import Loading from "../groups/Loading";
import axios from "../../config/axiosconfig";
import ViewGroup from "../groups/ViewGroup";
import TableGroup from "../groups/TableGroup";
import { useForm, Controller } from "react-hook-form";
import { MdEdit, MdDelete } from "react-icons/md";
import TablePagination from "../groups/TablePagination";
import endpoints from "../../config/config";
import { FaMoneyBill } from "react-icons/fa";

const TransactionsForm = ({
    setToast,
    postURL,
    defaultValues,
    transactionType,
    callBack,
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [post, setPost] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        setError,
        control,
        reset,
    } = useForm({
        defaultValues: {
            ...defaultValues,
            category: defaultValues?.category?.id,
        },
    });
    const formFunction = defaultValues ? "edit" : "add";
    const requestMethod = formFunction == "add" ? axios.post : axios.put;
    const [categories, setCategories] = useState(null);

    const fetchCategories = () => {
        axios
            .get(
                `${endpoints.financial_item_list}page_size=200&type=${transactionType}`
            )
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
    }, [transactionType]);

    const onSubmit = (data) => {
        setPost(true);

        data = {
            ...data,
            category: Number(data.category),
            amount: Number(data.amount),
            date: data.date
                ? data.date
                : new Date().toLocaleDateString("en-CA"),
        };

        // console.log(data);
        // return;

        requestMethod(postURL, data)
            .then((response) => {
                setPost(false);
                setToast(
                    formFunction == "add"
                        ? `تم إضافة ${
                              transactionType == "expenses" ? "مصروف" : "إيراد"
                          } جديد`
                        : `تم تعديل ${
                              transactionType == "expenses"
                                  ? "المصروف"
                                  : "الإيراد"
                          }`
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
            title={
                formFunction == "add"
                    ? transactionType === "expenses"
                        ? "إضافة مصروف"
                        : "إضافة إيراد"
                    : transactionType === "expenses"
                    ? "تعديل مصروف"
                    : "تعديل إيراد"
            }
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
                            <Label htmlFor="category" value="البند :" />
                        </div>
                        <Select
                            id="category"
                            type="select"
                            color={errors.category ? "failure" : "primary"}
                            {...register("category", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("category")}
                        >
                            {categories.map((category) => (
                                <option value={category.id} key={category.id}>
                                    {category?.name}
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
                            <Label htmlFor="amount" value="القيمة :" />
                        </div>
                        <TextInput
                            id="amount"
                            type="number"
                            rightIcon={FaMoneyBill}
                            placeholder="القيمة"
                            color={errors.amount ? "failure" : "primary"}
                            {...register("amount", {
                                required: "هذا الحقل مطلوب",
                            })}
                            onBlur={() => trigger("amount")}
                        />
                        {errors.amount && (
                            <p className="error-message">
                                {errors.amount.message}
                            </p>
                        )}
                    </div>
                    <div className="w-full lg:max-w-md lg:w-[30%]">
                        <div className="mb-2 block">
                            <Label htmlFor="date" value="التاريخ  :" />
                        </div>
                        <Controller
                            name="date"
                            control={control}
                            render={({ field }) => (
                                <Datepicker
                                    selected={field.value}
                                    id="date"
                                    language="ar"
                                    labelClearButton="مسح"
                                    labelTodayButton="اليوم"
                                    placeholder="تاريخ الميلاد"
                                    color={"primary"}
                                    onSelectedDateChanged={(date) => {
                                        field.onChange(
                                            date.toLocaleDateString("en-CA")
                                        );
                                    }}
                                />
                            )}
                        />
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

const ConfirmDelete = ({
    transaction,
    closeDrawer,
    setToast,
    transactionType,
    callBack,
}) => {
    const [post, setPost] = useState(false);

    const deleteManager = () => {
        setPost(true);
        axios
            .delete(transaction.url)
            .then(() => {
                setToast(
                    `تم حذف ${
                        transactionType === "expenses" ? "المصروف" : "الإيراد"
                    } بنجاح`
                );
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
                هل أنت متأكد تريد حذف{" "}
                {transactionType === "expenses" ? "المصروف" : "الإيراد"}:{" "}
                <span className="font-bold text-red-600">
                    {transaction?.category?.name}
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

const Transactions = ({ type }) => {
    //////////////////////////////// form settings ////////////////////////////////

    //////////////////////////////// drawer settings ////////////////////////////////
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState(null);

    //////////////////////////////// list data ////////////////////////////////
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState(null);
    const [toast, setToast] = useState(null);
    const [date, setDate] = useState(new Date().toLocaleDateString("en-CA"));
    const [searchParam, setSearchParam] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const showDrawer = (drawerFunction, transaction) => {
        if (drawerFunction == "edit") {
            setDrawerData({
                title: type === "expenses" ? "تعديل مصروف" : "تعديل إيراد",
                icon: MdEdit,
                content: (
                    <TransactionsForm
                        setToast={setToast}
                        postURL={transaction.url}
                        defaultValues={transaction}
                        transactionType={type}
                        callBack={() => {
                            fetchListData();
                            closeDrawer();
                        }}
                    />
                ),
            });
        } else {
            setDrawerData({
                title: type === "expense" ? "حذف مصروف" : "حذف إيراد",
                icon: MdDelete,
                content: (
                    <ConfirmDelete
                        transaction={transaction}
                        closeDrawer={closeDrawer}
                        setToast={setToast}
                        transactionType={type}
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
        const searchURL = `${endpoints.transaction_list}${`&type=${type}`}${
            searchParam ? `&search=${searchParam}` : ""
        }${pageNumber ? `&page=${pageNumber}` : ""}${
            date ? `&date=${date}` : ""
        }
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
    }, [searchParam, pageNumber, date, type]);

    return (
        <>
            {/* add form */}
            <TransactionsForm
                setToast={setToast}
                postURL={endpoints.transaction_list}
                callBack={fetchListData}
                transactionType={type}
            />

            {/* table data */}
            <ViewGroup
                title={`${
                    type == "expenses" ? "مصروفات" : "إيرادات"
                } يوم  ${date}`}
            >
                {loading ? (
                    <Loading />
                ) : fetchError ? (
                    <p className="text-lg text-center text-red-600 py-4">
                        خطأ في تحميل البيانات
                    </p>
                ) : (
                    <>
                        <div className="w-full lg:max-w-md mb-5">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="birth_date"
                                    value="التاريخ  :"
                                />
                            </div>
                            <Datepicker
                                id="birth_date"
                                language="ar"
                                labelClearButton="مسح"
                                labelTodayButton="اليوم"
                                placeholder="تاريخ الميلاد"
                                color={"primary"}
                                onSelectedDateChanged={(date) => {
                                    setDate(date.toLocaleDateString("en-CA"));
                                }}
                            />
                        </div>
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
                                        <Table.HeadCell>البند</Table.HeadCell>
                                        <Table.HeadCell>القيمة</Table.HeadCell>
                                        <Table.HeadCell>التاريخ</Table.HeadCell>
                                        <Table.HeadCell>إجراءات</Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body>
                                        {data.results.map((transaction) => {
                                            return (
                                                <Table.Row
                                                    key={transaction.id}
                                                    className="bg-white font-medium text-gray-900"
                                                >
                                                    <Table.Cell>
                                                        {transaction.category ? (
                                                            transaction.category
                                                                ?.name
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {transaction.amount ? (
                                                            transaction.amount
                                                        ) : (
                                                            <span className="text-red-600">
                                                                غير مسجل
                                                            </span>
                                                        )}
                                                    </Table.Cell>
                                                    <Table.Cell>
                                                        {transaction.date ? (
                                                            transaction.date
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
                                                                        transaction
                                                                    );
                                                                }}
                                                            />
                                                            <MdDelete
                                                                className="text-secondary cursor-pointer"
                                                                onClick={() => {
                                                                    showDrawer(
                                                                        "delete",
                                                                        transaction
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

export default Transactions;
