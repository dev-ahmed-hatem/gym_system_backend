import React, { useState, useEffect } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { HiUser, HiLockClosed } from "react-icons/hi";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import endpoints from "../../config/config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { fetchUserData } from "../../config/actions";

const Login = () => {
    // url configurations
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const next = params.get("next") || null;

    // forward to home if logged in
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("auth_user"));
        if (user) {
            navigate("/");
        }
    }, [navigate]);

    // form configurations
    const [post, setPost] = useState(false);
    const [loginError, setLoginError] = useState(false);
    const {
        register,
        handleSubmit,
        trigger,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        setPost(true);

        axios
            .post(endpoints.token_obtain, data)
            .then(async (response) => {
                localStorage.setItem("access_token", response.data.access);
                localStorage.setItem("refresh_token", response.data.refresh);
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Barer ${response.data.access}`;

                // get user data
                const userData = await fetchUserData();
                localStorage.setItem(
                    "auth_user",
                    JSON.stringify(userData ?? {})
                );

                navigate(next ?? "/");
            })
            .catch((error) => {
                console.log(error);
                setLoginError(true);
                reset();
            })
            .finally(() => {
                setPost(false);
            });
    };

    return (
        <div className="w-full h-svh overflow-hidden flex justify-center items-center bg-slate-200">
            <div
                className="login-container flex w-[80%] flex-col-reverse md:flex-row lg:w-[60%] overflow-hidden
                 shadow-xl justify-stretch md:justify-between bg-white h-[550px] md:h-[440px] rounded"
            >
                {/* right form */}
                <div className="form w-full md:w-1/2 h-[70%] md:h-full p-7 md:p-10 border-r-4 border-primary rounded">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col justify-around md:justify-evenly h-full"
                    >
                        <h1 className="font-bold text-2xl text-primary">
                            تسجيل دخول
                        </h1>

                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label
                                    htmlFor="username"
                                    value="اسم المستخدم : "
                                />
                            </div>
                            <TextInput
                                id="username"
                                type="text"
                                rightIcon={HiUser}
                                placeholder="اسم المستخدم"
                                color={errors.username ? "failure" : "primary"}
                                {...register("username", {
                                    required: "أدخل اسم المستخدم",
                                })}
                                onBlur={() => trigger("username")}
                                autoFocus
                            />
                            {errors.username && (
                                <p className="error-message">
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        <div className="w-full">
                            <div className="mb-2 block">
                                <Label htmlFor="pass" value="كلمة المرور :" />
                            </div>
                            <TextInput
                                id="pass"
                                type="password"
                                rightIcon={HiLockClosed}
                                placeholder="كلمة المرور"
                                color={errors.password ? "failure" : "primary"}
                                {...register("password", {
                                    required: "أدخل كلمة المرور",
                                })}
                                onBlur={() => trigger("password")}
                            />
                            {errors.password && (
                                <p className="error-message">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {loginError && (
                            <p className="font-bold text-secondary text-center">
                                بيانات تسجيل خاطئة
                            </p>
                        )}

                        <div className="flex flex-wrap max-h-12 min-w-full justify-center">
                            <Button
                                type="submit"
                                color={"primary"}
                                disabled={post}
                                className="w-fit h-10 flex justify-center items-center"
                                size={"xl"}
                                isProcessing={post}
                                processingSpinner={
                                    <AiOutlineLoading className="h-6 w-6 animate-spin" />
                                }
                            >
                                تسجيل دخول
                            </Button>
                        </div>
                    </form>
                </div>

                {/* left logo */}
                <div
                    className="logo w-full md:w-1/2 h-[30%] md:h-full flex justify-center items-center bg-gradient-to-l
                 from-primary-400 to-primary-200 "
                >
                    <img className="w-32 h-full" src="vite.svg" alt="" />
                </div>
            </div>
        </div>
    );
};

export default Login;
