import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from "react-icons/md";

const SignUpPage = () => {
    const [signUpData, setSignUpData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    });

    const queryClientInstance = useQueryClient();

    const {
        mutate: triggerSignUp,
        isError: hasSignUpError,
        isPending: isSigningUp,
        error: signUpError,
    } = useMutation({
        mutationFn: async ({ email, username, fullName, password }) => {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, username, fullName, password }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to create account");
                console.log(data);
                return data;
            } catch (error) {
                console.error(error);
                if (error.message.includes("Unexpected")) {
                    throw new Error("Backend Server is down right now!");
                }
                throw new Error("Failed to create account");
            }
        },
        onSuccess: () => {
            toast.success("Yipee! You are added to Our Family!");
            queryClientInstance.invalidateQueries({ queryKey: ["authUser"] });
        },
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        triggerSignUp(signUpData);
    };

    const handleInputChange = (e) => {
        setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    };

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <XSvg className='lg:w-2/3 fill-white' />
            </div>
            
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleFormSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' />
                    
                    <h1 className='text-4xl font-extrabold text-white'>Join today.</h1>
                    
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={signUpData.email}
                            required
                        />
                    </label>
                    
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={signUpData.username}
                                required
                            />
                        </label>
                        
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <MdDriveFileRenameOutline />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Full Name'
                                name='fullName'
                                onChange={handleInputChange}
                                value={signUpData.fullName}
                                required
                            />
                        </label>
                    </div>
                    
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={signUpData.password}
                            required
                        />
                    </label>
                    
                    <button className='btn rounded-full btn-primary text-white'>
                        {isSigningUp ? "Loading..." : "Sign up"}
                    </button>
                    
                    {hasSignUpError && <p className='text-red-500'>{signUpError.message}</p>}
                </form>
                
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-lg'>Already have an account?</p>
                    <Link to='/login'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
