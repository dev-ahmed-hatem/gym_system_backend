import React, { useState, useRef, forwardRef, useEffect } from "react";
import { CgProfile } from "react-icons/cg";

const CustomFileInput = forwardRef(
    (
        { register, name, setValue, selectedFile, setSelectedFile, error },
        ref
    ) => {
        const [isDragging, setIsDragging] = useState(false);
        const [fileError, setFileError] = useState(error);
        const labelRef = useRef(null);

        const handleFileChange = (event) => {
            const file = event.target.files[0];

            const supportedFileTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
            if (file) {
                if (supportedFileTypes.includes(file.type)) {
                    setFileError(null);
                    setSelectedFile(file.name);
                    setValue(name, file);
                } else {
                    setFileError("نوع ملف غير مدعوم");
                    setSelectedFile(null);
                    setValue(name, null);
                }
            }
        };

        const handleDrop = (event) => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];

            const supportedFileTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
            if (file) {
                if (supportedFileTypes.includes(file.type)) {
                    setFileError(null);
                    setSelectedFile(file.name);
                    setValue(name, file);
                } else {
                    setFileError("نوع ملف غير مدعوم");
                    setSelectedFile(null);
                    setValue(name, null);
                }
            }
        };

        const handleDragOver = function (event) {
            event.preventDefault();
            if (labelRef.current) {
                setIsDragging(true);
            }
        };

        const handleDragLeave = function (event) {
            event.preventDefault();
            if (labelRef.current) {
                setIsDragging(false);
            }
        };

        return (
            <div className="flex items-center justify-center w-full">
                <label
                    ref={labelRef}
                    htmlFor="file-input"
                    className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed ${
                        fileError ? "border-red-400" : ""
                    }
                 rounded-lg cursor-pointer hover:bg-gray-100 ${
                     isDragging ? "bg-gray-200" : "bg-gray-50"
                 } ${fileError ? "bg-red-100" : ""}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <CgProfile className="text-3xl text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                                اضغظ لاختيار صورة
                            </span>{" "}
                            <span className="hidden lg:inline">
                                أو قم بسحب الصورة إلى هنا
                            </span>
                        </p>

                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {selectedFile
                                ? selectedFile
                                : "(لم يتم اختيار صورة)"}
                        </p>

                        {fileError && (
                            <p className="error-message">{fileError}</p>
                        )}
                    </div>
                    <input
                        id="file-input"
                        type="file"
                        className="hidden"
                        {...register(name)}
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.webp"
                    />
                </label>
            </div>
        );
    }
);

export default CustomFileInput;
