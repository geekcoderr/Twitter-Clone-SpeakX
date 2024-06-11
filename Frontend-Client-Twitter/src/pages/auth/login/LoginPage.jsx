import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail, MdPassword } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
    const [loginData, setLoginData] = useState({
        username: "",
        password: "",
    });

    const queryClientInstance = useQueryClient();

    const {
        mutate: triggerLogin,
        isPending: isLoggingIn,
        isError: hasLoginError,
        error: loginError,
    } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const response = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        throw new Error("Credentials Invalid!");
                    }
                    throw new Error(result.error || "Failed to Log you In!");
                }
            } catch (error) {
                if (error.message.includes("Unexpected")) {
                    throw new Error("Backend Server is down right now!");
                }
                
                throw new Error(error.message);
            }
        },
        onSuccess: () => {
            queryClientInstance.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        triggerLogin(loginData);
    };

    const handleInputChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <XSvg className='lg:w-2/3 fill-white' />
            </div>
            
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col' onSubmit={handleFormSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' /> 
                    
                    <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1> 
                    
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='text'
                            className='grow'
                            placeholder='username'
                            name='username'
                            onChange={handleInputChange}
                            value={loginData.username}
                            required
                        /> 
                    </label>

                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={loginData.password}
                            required
                        /> 
                    </label>
                    
                    <button className='btn rounded-full btn-primary text-white'>
                        {isLoggingIn ? "Loading..." : "Login"}
                    </button> 
                    
                    {hasLoginError && <p className='text-red-500'>{loginError.message}</p>} 
                </form>
                
                <div className='flex flex-col gap-2 mt-4'>
                    <p className='text-white text-lg'>{"Don't"} have an account?</p>
                    <Link to='/signup'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
                    </Link> 
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
