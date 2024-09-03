import React, { useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { Label, Button, Select } from "flowbite-react";
import { useForm } from "react-hook-form";
import endpoints from "../../../config/config";
import { fetch_list_data } from "../../../config/actions";

const MonthlyReportForm = ({ setLoading, setFetchError, setData }) => {
    const [post, setPost] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const {
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const url = `${endpoints.duration_reports}month=${currentMonth}&year=${currentYear}`;

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
            <h1 className="font-bold text-text text-lg">عرض تقارير شهر :</h1>
            <hr className="h-px my-3 bg-gray-200 border-0"></hr>
            <form
                className="fields flex gap-x-10 gap-y-6 flex-wrap"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="year" value="السنة :" />
                    </div>
                    <Select
                        id="year"
                        type="select"
                        placeholder="السنة"
                        color={"primary"}
                        defaultValue={currentYear}
                        onChange={(event) => {
                            setCurrentYear(event.target.value);
                        }}
                    >
                        {Array.from(
                            { length: currentYear - 2023 },
                            (_, i) => 2024 + i
                        ).map((num) => (
                            <option value={num} key={num}>
                                {num}
                            </option>
                        ))}
                    </Select>
                    {errors.year && (
                        <p className="error-message">{errors.year.message}</p>
                    )}
                </div>
                <div className="w-full lg:max-w-md lg:w-[30%]">
                    <div className="mb-2 block">
                        <Label htmlFor="month" value="الشهر :" />
                    </div>
                    <Select
                        id="month"
                        type="select"
                        placeholder="الشهر"
                        color={"primary"}
                        defaultValue={currentMonth}
                        onChange={(event) => {
                            setCurrentMonth(event.target.value);
                        }}
                    >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                            (num) => (
                                <option value={num} key={num}>
                                    {num}
                                </option>
                            )
                        )}
                    </Select>
                    {errors.month && (
                        <p className="error-message">{errors.month.message}</p>
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

export default MonthlyReportForm;
