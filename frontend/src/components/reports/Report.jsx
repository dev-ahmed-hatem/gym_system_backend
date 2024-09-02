import React, { useState } from "react";
import { Label, Table, Checkbox } from "flowbite-react";
import Loading from "../groups/Loading";
import ViewGroup from "../groups/ViewGroup";
import { usePermission } from "../../providers/PermissionProvider";
import ErrorGroup from "../groups/ErrorGroup";
import DailyReportForm from "./forms/DailyReportForm";

const Report = () => {
    //////////////////////////////// list data ////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [data, setData] = useState(null);
    const [lists, setLists] = useState({
        incomes: true,
        expenses: true,
        subscriptions: true,
        clients: true,
        sales: true,
        products: true,
    });

    //////////////////////////////// permissions ////////////////////////////////
    const { set_page_permissions } = usePermission();
    const permissions = set_page_permissions("clients", "client");

    if (!permissions.view)
        return (
            <ErrorGroup
                title={"العملاء الحاليين"}
                message={"ليس لديك صلاحية"}
            />
        );

    const handleChange = (event) => {
        let key = event.target.id;

        setLists((prevLists) => {
            return { ...prevLists, [key]: !prevLists[key] };
        });
    };

    return (
        <>
            {/* search form */}
            <DailyReportForm
                setLoading={setLoading}
                setFetchError={setFetchError}
                setData={setData}
            />

            {/* table data */}
            {(data || loading || fetchError) && (
                <ViewGroup title={"النتائج"}>
                    {loading ? (
                        <Loading />
                    ) : fetchError ? (
                        <p className="text-lg text-center text-red-600 py-4">
                            خطأ في تحميل البيانات
                        </p>
                    ) : (
                        <div className="flex flex-col gap-y-5">
                            <div className="lists flex flex-wrap gap-x-10 gap-y-2 my-4">
                                <div className="text-lg">القوائم :</div>
                                <div className="flex gap-x-2 items-center">
                                    <Checkbox
                                        id="incomes"
                                        onChange={handleChange}
                                        color="yellow"
                                        checked={lists.incomes}
                                    />
                                    <Label
                                        htmlFor="incomes"
                                        value="الإيرادات"
                                        className="text-lg"
                                    />
                                </div>
                                <div className="flex gap-x-3 items-center">
                                    <Checkbox
                                        id="expenses"
                                        onChange={handleChange}
                                        color="yellow"
                                        checked={lists.expenses}
                                    />
                                    <Label
                                        htmlFor="expenses"
                                        value="المصروفات"
                                        className="text-lg"
                                    />
                                </div>
                                <div className="flex gap-x-3 items-center">
                                    <Checkbox
                                        id="subscriptions"
                                        onChange={handleChange}
                                        color="yellow"
                                        checked={lists.subscriptions}
                                    />
                                    <Label
                                        htmlFor="subscriptions"
                                        value="الاشتراكات"
                                        className="text-lg"
                                    />
                                </div>
                                <div className="flex gap-x-3 items-center">
                                    <Checkbox
                                        id="clients"
                                        onChange={handleChange}
                                        color="yellow"
                                        checked={lists.clients}
                                    />
                                    <Label
                                        htmlFor="clients"
                                        value="الأعضاء"
                                        className="text-lg"
                                    />
                                </div>
                                <div className="flex gap-x-3 items-center">
                                    <Checkbox
                                        id="sales"
                                        onChange={handleChange}
                                        color="yellow"
                                        checked={lists.sales}
                                    />
                                    <Label
                                        htmlFor="sales"
                                        value="طلبات المنتجات"
                                        className="text-lg"
                                    />
                                </div>
                                <div className="flex gap-x-3 items-center">
                                    <Checkbox
                                        id="products"
                                        onChange={handleChange}
                                        color="yellow"
                                        checked={lists.products}
                                    />
                                    <Label
                                        htmlFor="products"
                                        value="المنتجات"
                                        className="text-lg"
                                    />
                                </div>
                            </div>

                            {/* incomes */}
                            {lists.incomes && (
                                <div className="table-wrapper w-full overflow-x-auto">
                                    <h1 className="w-full text-lg text-center text-white py-3 font-bold bg-primary-900 rounded-t-lg">
                                        الإيرادات
                                    </h1>
                                    <Table
                                        striped
                                        className="font-bold text-right"
                                    >
                                        {data?.incomes?.length == 0 ? (
                                            <Table.Body className="!rounded-none">
                                                <Table.Row className="text-lg text-center py-3 font-bold !rounded-t-none">
                                                    <Table.Cell className="!rounded-t-none">
                                                        لا توجد إيرادات
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        ) : (
                                            <>
                                                <Table.Head>
                                                    <Table.HeadCell>
                                                        البند
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        القيمة
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {data.incomes.map(
                                                        (transaction) => (
                                                            <Table.Row
                                                                key={
                                                                    transaction.id
                                                                }
                                                                className="bg-white font-medium text-gray-900"
                                                            >
                                                                <Table.Cell>
                                                                    {transaction.category ? (
                                                                        transaction
                                                                            .category
                                                                            ?.name
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {transaction.amount ? (
                                                                        transaction.amount
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    )}
                                                    <Table.Row className="font-bold text-lg">
                                                        <Table.Cell>
                                                            الإجمالى
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {data.total_incomes}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </>
                                        )}
                                    </Table>
                                </div>
                            )}

                            {/* expenses */}
                            {lists.expenses && (
                                <div className="table-wrapper w-full overflow-x-auto">
                                    <h1 className="w-full text-lg text-center text-white py-3 font-bold bg-primary-900 rounded-t-lg">
                                        المصروفات
                                    </h1>
                                    <Table
                                        striped
                                        className="font-bold text-right"
                                    >
                                        {data?.expenses?.length == 0 ? (
                                            <Table.Body className="!rounded-none">
                                                <Table.Row className="text-lg text-center py-3 font-bold !rounded-t-none">
                                                    <Table.Cell className="!rounded-t-none">
                                                        لا توجد مصروفات
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        ) : (
                                            <>
                                                <Table.Head>
                                                    <Table.HeadCell>
                                                        البند
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        القيمة
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {data.expenses.map(
                                                        (transaction) => (
                                                            <Table.Row
                                                                key={
                                                                    transaction.id
                                                                }
                                                                className="bg-white font-medium text-gray-900"
                                                            >
                                                                <Table.Cell>
                                                                    {transaction.category ? (
                                                                        transaction
                                                                            .category
                                                                            ?.name
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {transaction.amount ? (
                                                                        transaction.amount
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    )}
                                                    <Table.Row className="font-bold text-lg">
                                                        <Table.Cell>
                                                            الإجمالى
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {
                                                                data.total_expenses
                                                            }
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </>
                                        )}
                                    </Table>
                                </div>
                            )}

                            {/* subscriptions */}
                            {lists.subscriptions && (
                                <div className="table-wrapper w-full overflow-x-auto">
                                    <h1 className="w-full text-lg text-center text-white py-3 font-bold bg-primary-900 rounded-t-lg">
                                        الاشتراكات
                                    </h1>
                                    <Table
                                        striped
                                        className="font-bold text-right"
                                    >
                                        {data?.subscriptions?.length == 0 ? (
                                            <Table.Body className="!rounded-none">
                                                <Table.Row className="text-lg text-center py-3 font-bold !rounded-t-none">
                                                    <Table.Cell className="!rounded-t-none">
                                                        لا توجد اشتراكات
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        ) : (
                                            <>
                                                <Table.Head>
                                                    <Table.HeadCell>
                                                        الاشتراك
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        العدد
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {data.subscriptions.map(
                                                        (plan) => (
                                                            <Table.Row
                                                                key={plan.id}
                                                                className="bg-white font-medium text-gray-900"
                                                            >
                                                                <Table.Cell>
                                                                    {plan.name ? (
                                                                        plan.name
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {plan.num_subscriptions ? (
                                                                        plan.num_subscriptions
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    )}
                                                    <Table.Row className="font-bold text-lg">
                                                        <Table.Cell>
                                                            الإجمالى
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {
                                                                data.total_subscriptions
                                                            }
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </>
                                        )}
                                    </Table>
                                </div>
                            )}

                            {/* clients */}
                            {lists.clients && (
                                <div className="table-wrapper w-full overflow-x-auto">
                                    <h1 className="w-full text-lg text-center text-white py-3 font-bold bg-primary-900 rounded-t-lg">
                                        الأعضاء
                                    </h1>
                                    <Table
                                        striped
                                        className="font-bold text-right"
                                    >
                                        {data?.clients?.length == 0 ? (
                                            <Table.Body className="!rounded-none">
                                                <Table.Row className="text-lg text-center py-3 font-bold !rounded-t-none">
                                                    <Table.Cell className="!rounded-t-none">
                                                        لا توجد أعضاء
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        ) : (
                                            <>
                                                <Table.Head>
                                                    <Table.HeadCell>
                                                        اسم العميل
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        الكود
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {data.clients.map(
                                                        (client) => (
                                                            <Table.Row
                                                                key={client.id}
                                                                className="bg-white font-medium text-gray-900"
                                                            >
                                                                <Table.Cell>
                                                                    {client.name ? (
                                                                        client.name
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {client.id ? (
                                                                        client.id
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    )}
                                                    <Table.Row className="font-bold text-lg">
                                                        <Table.Cell>
                                                            الإجمالى
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {data.total_clients}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </>
                                        )}
                                    </Table>
                                </div>
                            )}

                            {/* sales */}
                            {lists.sales && (
                                <div className="table-wrapper w-full overflow-x-auto">
                                    <h1 className="w-full text-lg text-center text-white py-3 font-bold bg-primary-900 rounded-t-lg">
                                        طلبات المنتجات
                                    </h1>
                                    <Table
                                        striped
                                        className="font-bold text-right"
                                    >
                                        {data?.sales?.length == 0 ? (
                                            <Table.Body className="!rounded-none">
                                                <Table.Row className="text-lg text-center py-3 font-bold !rounded-t-none">
                                                    <Table.Cell className="!rounded-t-none">
                                                        لا توجد طلبات منتجات
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        ) : (
                                            <>
                                                <Table.Head>
                                                    <Table.HeadCell>
                                                        كود الطلب
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        القيمة
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {data.sales.map((sale) => (
                                                        <Table.Row
                                                            key={sale.id}
                                                            className="bg-white font-medium text-gray-900"
                                                        >
                                                            <Table.Cell>
                                                                {sale.id ? (
                                                                    sale.id
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                            <Table.Cell>
                                                                {sale.total_price ? (
                                                                    sale.total_price
                                                                ) : (
                                                                    <span className="text-red-600">
                                                                        غير مسجل
                                                                    </span>
                                                                )}
                                                            </Table.Cell>
                                                        </Table.Row>
                                                    ))}
                                                    <Table.Row className="font-bold text-lg">
                                                        <Table.Cell>
                                                            الإجمالى
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {data.total_sales}
                                                        </Table.Cell>
                                                    </Table.Row>
                                                </Table.Body>
                                            </>
                                        )}
                                    </Table>
                                </div>
                            )}

                            {/* products */}
                            {lists.products && (
                                <div className="table-wrapper w-full overflow-x-auto">
                                    <h1 className="w-full text-lg text-center text-white py-3 font-bold bg-primary-900 rounded-t-lg">
                                        المنتجات
                                    </h1>
                                    <Table
                                        striped
                                        className="font-bold text-right"
                                    >
                                        {data?.products?.length == 0 ? (
                                            <Table.Body className="!rounded-none">
                                                <Table.Row className="text-lg text-center py-3 font-bold !rounded-t-none">
                                                    <Table.Cell className="!rounded-t-none">
                                                        لا توجد منتجات مباعة
                                                    </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        ) : (
                                            <>
                                                <Table.Head>
                                                    <Table.HeadCell>
                                                        المنتج
                                                    </Table.HeadCell>
                                                    <Table.HeadCell>
                                                        القطع المباعة
                                                    </Table.HeadCell>
                                                </Table.Head>
                                                <Table.Body>
                                                    {data.products.map(
                                                        (product) => (
                                                            <Table.Row
                                                                key={product.id}
                                                                className="bg-white font-medium text-gray-900"
                                                            >
                                                                <Table.Cell>
                                                                    {product.name ? (
                                                                        product.name
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    {product.total_sold ? (
                                                                        product.total_sold
                                                                    ) : (
                                                                        <span className="text-red-600">
                                                                            غير
                                                                            مسجل
                                                                        </span>
                                                                    )}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        )
                                                    )}
                                                </Table.Body>
                                            </>
                                        )}
                                    </Table>
                                </div>
                            )}
                        </div>
                    )}
                </ViewGroup>
            )}
        </>
    );
};

export default Report;
