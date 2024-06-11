import { useState } from "react"; // Import useState from React
import { Link } from "react-router-dom"; // Import Link from react-router-dom

import XSvg from "../../../components/svgs/X"; // Import custom SVG component

import { MdOutlineMail, MdPassword } from "react-icons/md"; // Import mail and password icons from react-icons

import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQueryClient from react-query

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    }); // State to manage form data

    const queryClient = useQueryClient(); // Query client for cache management

    const {
        mutate: loginMutation,
        isPending,
        isError,
        error,
    } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username, password }),
                }); // Perform login request

                const data = await res.json(); // Parse JSON response

                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong");
                } // Handle non-OK responses
            } catch (error) {

                throw new Error("Something went wrong");
            } // Handle fetch errors
        },
        onSuccess: () => {
            // Refetch the authUser
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
    }); // Mutation for login

    const handleSubmit = (e) => {
        e.preventDefault();
        loginMutation(formData);
    }; // Handle form submission

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }; // Handle input changes

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <XSvg className='lg:w-2/3 fill-white' />
            </div> {/* SVG container for large screens */}
            
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' /> {/* SVG for small screens */}
                    
                    <h1 className='text-4xl font-extrabold text-white'>{"Let's"} go.</h1> {/* Page title */}
                    
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='text'
                            className='grow'
                            placeholder='username'
                            name='username'
                            onChange={handleInputChange}
                            value={formData.username}
                        /> {/* Username input */}
                    </label>

                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdPassword />
                        <input
                            type='password'
                            className='grow'
                            placeholder='Password'
                            name='password'
                            onChange={handleInputChange}
                            value={formData.password}
                        /> {/* Password input */}
                    </label>
                    
                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending ? "Loading..." : "Login"}
                    </button> {/* Login button with loading state */}
                    
                    {isError && <p className='text-red-500'>{error.message}</p>} {/* Display error message */}
                </form>
                
                <div className='flex flex-col gap-2 mt-4'>
                    <p className='text-white text-lg'>{"Don't"} have an account?</p>
                    <Link to='/signup'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign up</button>
                    </Link> {/* Signup link */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage; // Export LoginPage component
