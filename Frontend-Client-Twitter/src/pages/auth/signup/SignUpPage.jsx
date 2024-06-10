import { useState } from "react"; // Import useState from React
import { Link } from "react-router-dom"; // Import Link from react-router-dom

import XSvg from "../../../components/svgs/X"; // Import custom SVG component

import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import useMutation and useQueryClient from react-query
import toast from "react-hot-toast"; // Import toast for notifications
import { FaUser } from "react-icons/fa"; // Import user icon from react-icons
import { MdDriveFileRenameOutline, MdOutlineMail, MdPassword } from "react-icons/md"; // Import mail icon from react-icons

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        fullName: "",
        password: "",
    }); // State to manage form data

    const queryClient = useQueryClient(); // Query client for cache management

    const { mutate, isError, isPending, error } = useMutation({
        mutationFn: async ({ email, username, fullName, password }) => {
            try {
                const res = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email, username, fullName, password }),
                }); // Perform signup request

                const data = await res.json(); // Parse JSON response
                if (!res.ok) throw new Error(data.error || "Failed to create account");
                console.log(data);
                return data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success("Account created successfully"); // Notify user of successful account creation

            queryClient.invalidateQueries({ queryKey: ["authUser"] }); // Invalidate authUser query
        },
    }); // Mutation for signup

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload on form submission
        mutate(formData);
    }; // Handle form submission

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }; // Handle input changes

    return (
        <div className='max-w-screen-xl mx-auto flex h-screen px-10'>
            <div className='flex-1 hidden lg:flex items-center justify-center'>
                <XSvg className='lg:w-2/3 fill-white' />
            </div> {/* SVG container for large screens */}
            
            <div className='flex-1 flex flex-col justify-center items-center'>
                <form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
                    <XSvg className='w-24 lg:hidden fill-white' /> {/* SVG for small screens */}
                    
                    <h1 className='text-4xl font-extrabold text-white'>Join today.</h1> {/* Page title */}
                    
                    <label className='input input-bordered rounded flex items-center gap-2'>
                        <MdOutlineMail />
                        <input
                            type='email'
                            className='grow'
                            placeholder='Email'
                            name='email'
                            onChange={handleInputChange}
                            value={formData.email}
                        /> {/* Email input */}
                    </label>
                    
                    <div className='flex gap-4 flex-wrap'>
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <FaUser />
                            <input
                                type='text'
                                className='grow '
                                placeholder='Username'
                                name='username'
                                onChange={handleInputChange}
                                value={formData.username}
                            /> {/* Username input */}
                        </label>
                        
                        <label className='input input-bordered rounded flex items-center gap-2 flex-1'>
                            <MdDriveFileRenameOutline />
                            <input
                                type='text'
                                className='grow'
                                placeholder='Full Name'
                                name='fullName'
                                onChange={handleInputChange}
                                value={formData.fullName}
                            /> {/* Full name input */}
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
                            value={formData.password}
                        /> {/* Password input */}
                    </label>
                    
                    <button className='btn rounded-full btn-primary text-white'>
                        {isPending ? "Loading..." : "Sign up"}
                    </button> {/* Signup button with loading state */}
                    
                    {isError && <p className='text-red-500'>{error.message}</p>} {/* Display error message */}
                </form>
                
                <div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
                    <p className='text-white text-lg'>Already have an account?</p>
                    <Link to='/login'>
                        <button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
                    </Link> {/* Signin link */}
                </div>
            </div>
        </div>
    );
};

export default SignUpPage; // Export SignUpPage component
