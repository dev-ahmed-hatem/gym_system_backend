import { useState } from "react";
import { Button } from "flowbite-react";
import axios from "../../config/axiosconfig";
import { useToast } from "../../providers/ToastProvider";
import { AiOutlineLoading } from "react-icons/ai";

const ConfirmDelete = ({
    deleteURL,
    deletePrompt,
    itemName,
    closeDrawer,
    callBack,
    toastMessage,
}) => {
    const [post, setPost] = useState(false);
    const { showToast } = useToast();

    const deleteManager = () => {
        setPost(true);
        axios
            .delete(deleteURL)
            .then(() => {
                showToast(toastMessage);
                if (callBack) callBack();
                closeDrawer();
            })
            .catch((error) => {
                console.log(error);
                showToast("خطأ فى تنفيذ العملية", true);
            })
            .finally(() => {
                setPost(false);
            });
    };

    return (
        <div
            className={`wrapper p-4 my-2 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <p className="text-base">
                {deletePrompt}:{" "}
                <span className="font-bold text-red-600">{itemName}</span>
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
                    isProcessing={post}
                    processingSpinner={
                        <AiOutlineLoading className="h-6 w-6 animate-spin" />
                    }
                >
                    حذف
                </Button>
            </div>
        </div>
    );
};

export default ConfirmDelete;
