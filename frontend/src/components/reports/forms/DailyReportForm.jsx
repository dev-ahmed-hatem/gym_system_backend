import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, Datepicker } from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import endpoints from "../../../config/config";
import { fetch_list_data } from "../../../config/actions";

const DailyReportForm = ({ setLoading, setFetchError, setData }) => {
    const [post, setPost] = useState(false);
    const today = new Date().toLocaleDateString("en-CA");
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm({ defaultValues: { day: today } });

    const onSubmit = (data) => {
        const url = `${endpoints.duration_reports}from=${data.day}&to=${data.day}`;
        setPost(true);
        setLoading(true);

        fetch_list_data({
            searchURL: url,
            setData: setData,
            setFetchError: setFetchError,
            setLoading: () => {
                setPost(false);
                setLoading(false);
            },
        });
    };

    return (
        <div
            className={`wrapper p-4 my-8 bg-white rounded border-t-4 border-primary shadow-lg`}
        >
            <h1 className="font-bold text-text text-lg">عرض تقارير يوم :</h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="day" value="اليوم :" />
                    </div>
                    <Controller
                        name="day"
                        control={control}
                        rules={{ required: "" }}
                        render={({ field }) => (
                            <Datepicker
                                selected={field.value}
                                id="day"
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
                                {...field}
                            />
                        )}
                    />
                    {errors.day && (
                        <p className="error-message">{errors.day.message}</p>
                    )}
                </div>

                <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                    <Button
                        type="submit"
                        color={"primary"}
                        disabled={post}
                        className="w-32 h-10 flex justify-center items-center"
                        size={"xl"}
                        isProcessing={post}
                        processingSpinner={
                            <AiOutlineLoading className="h-6 w-6 animate-spin" />
                        }
                    >
                        بحث
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default DailyReportForm;
