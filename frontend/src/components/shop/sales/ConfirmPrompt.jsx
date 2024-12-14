import React, { useEffect, useState } from "react";
import axios from "../../../config/axiosconfig";
import { useToast } from "../../../providers/ToastProvider";
import { Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";

const ConfirmPrompt = ({ sale, state, closeDrawer, callBack }) => {
    const { showToast } = useToast();
    const [post, setPost] = useState(false);
    const [insufficient, setInsufficient] = useState(null);

    const confirm_sale = () => {
        setPost(true);
        axios
            .get(`${sale.url}confirm_sale`)
            .then(() => {
                showToast("تم تأكيد البيع");
                if (callBack) callBack();
                closeDrawer();
            })
            .catch((error) => {
                if (error.response.data.detail == "insufficient") {
                    let insufficient = [];
                    for (let i of error.response.data.insufficient_items) {
                        insufficient.push(i);
                    }
                    setInsufficient(insufficient);
                } else {
                    console.log(error);
                    showToast("خطأ فى تنفيذ العملية", true);
                }
            })
            .finally(() => {
                setPost(false);
            });
    };

    return (
        <div
            className={`wrapper p-4 my-2 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            {state == "confirm" ? (
                <>
                    <p className="text-base">
                        تأكيد عملية البيع :{" "}
                        <span className="font-bold text-red-600">
                            {sale.id}
                        </span>{" "}
                        ؟
                    </p>
                    <p>محتوى الطلب :</p>
                </>
            ) : (
                <p>
                    محتوى الطلب{" "}
                    <span className="font-bold text-green-600">{sale.id}</span>{" "}
                    :
                </p>
            )}

            <table className="text-center font-ligh my-5 w-full">
                <thead>
                    <tr>
                        <th className="h-8 text-center border-[0.5px] border-black">
                            المنتج
                        </th>
                        <th className="h-8 text-center border-[0.5px] border-black">
                            السعر
                        </th>
                        <th className="h-8 text-center border-[0.5px] border-black">
                            الكمية
                        </th>
                        <th className="h-8 text-center border-[0.5px] border-black">
                            إجمالى
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* Table Body */}
                    {sale?.items?.map((item, index) => (
                        <tr key={index}>
                            <td className="h-8 text-center border-[0.5px] border-black">
                                {item.product.name}
                            </td>
                            <td className="h-8 text-center border-[0.5px] border-black">
                                {item.price ? (
                                    <span>
                                        <span className="line-through text-red-600 inline-block mx-2 text-sm">
                                            {Number.parseInt(
                                                item.product.sell_price
                                            )}
                                        </span>
                                        <span>
                                            {Number.parseInt(item.price)}
                                        </span>
                                    </span>
                                ) : (
                                    Number.parseInt(item.product.sell_price)
                                )}
                            </td>
                            <td className="h-8 text-center border-[0.5px] border-black">
                                {Number.parseInt(item.amount)}
                            </td>
                            <td className="h-8 text-center border-[0.5px] border-black">
                                {item.total_price}
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td
                            className="h-8 text-center border border-black"
                            colSpan={1}
                        >
                            إجمالى
                        </td>
                        <td
                            className="h-8 text-center border border-black"
                            colSpan={3}
                        >
                            {sale.total_price} جنيه
                        </td>
                    </tr>
                    <tr>
                        <td
                            className="h-8 text-center border border-black"
                            colSpan={1}
                        >
                            الخصم
                        </td>
                        <td
                            className="h-8 text-center border border-black"
                            colSpan={3}
                        >
                            {sale.discount} %
                        </td>
                    </tr>
                    <tr>
                        <td
                            className="h-8 text-center border border-black"
                            colSpan={1}
                        >
                            الصافى
                        </td>
                        <td
                            className="h-8 text-center border border-black"
                            colSpan={3}
                        >
                            {sale.after_discount} جنيه
                        </td>
                    </tr>
                </tbody>
            </table>
            {state == "confirm" ? (
                <>
                    <div className="w-full my-3">
                        <p>
                            سيتم إضافة إيراد بقيمة{" "}
                            <span className="text-primary font-bold mx-2">
                                {sale.after_discount}{" "}
                            </span>
                            بتاريخ اليوم
                        </p>
                    </div>
                    {insufficient && (
                        <div className="w-full my-3 font-bold text-secondary">
                            <p>لا يوجد مخزون كاف للمنتجات الآتية : </p>
                            {insufficient.map((product, index) => (
                                <span key={index} className="ms-5 block">
                                    {product}
                                </span>
                            ))}
                        </div>
                    )}
                    <hr className="h-px my-3 bg-gray-200 border-0"></hr>
                    <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                        <Button
                            type="button"
                            color={"failure"}
                            className="me-4"
                            disabled={post}
                            onClick={closeDrawer}
                        >
                            إلغاء
                        </Button>
                        <Button
                            type="button"
                            color={"green"}
                            disabled={post}
                            onClick={confirm_sale}
                            isProcessing={post}
                            processingSpinner={
                                <AiOutlineLoading className="h-6 w-6 animate-spin" />
                            }
                        >
                            تأكيد
                        </Button>
                    </div>
                </>
            ) : (
                <span>
                    تم تأكيد الطلب بتاريخ :
                    <span className={`mx-3 font-bold text-green-500`}>
                        {sale.confirm_date}
                    </span>
                </span>
            )}
        </div>
    );
};

export default ConfirmPrompt;
