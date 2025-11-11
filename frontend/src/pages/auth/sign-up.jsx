import React, {useEffect, useState} from 'react'
import * as z from 'zod'
import useStore from "../../store/index.js";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Link, useNavigate} from "react-router-dom";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../../componants/card.jsx";
import {SocialAuth} from "../../componants/social-auth.jsx";
import {Separator} from "../../componants/separator.jsx";
import Input from "../../componants/input.jsx";
import {Button} from "../../componants/button.js";
import {BiLoader} from "react-icons/bi";
import {toast} from "sonner";
import api from "../../libs/apiCall.js";

const RegistrationSchema = z.object({
    email: z
        .string({required_error: "Email is required"})
        .email({message: "Not a valid email"}),
    firstName: z.string({required_error: "First name is required"})
        .min(3, "First name must be at least 3 characters long"),
    password: z.string({required_error: "Password is required"})
        .min(8, "Password must be at least 8 characters long"),
})


const SignUp = () => {
    const {user} = useStore((state) => state)
    console.log(user);
    const {register, handleSubmit, formState: {errors},} = useForm({
        resolver: zodResolver(RegistrationSchema)
    })
    const navigate = useNavigate();
    const [loading, setLoading] = useState();

    useEffect(() => {
        user && navigate("/")
    }, [user]);

    const onSubmit = async (data) => {
        try {

            setLoading(true)
            const {data: res} = await api.post('/auth/sign-up', data);
            if (res?.data.user){
                toast.success("Account created successfully. You can now login.");
                setTimeout(() => {
                    navigate("/sign-in")
                }, 1500)
            }
        } catch (e) {
            console.log(e);
            toast.error(e?.response?.data?.message || e.message);
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className='flex items-center justify-center w-full min-h-screen py-10'>
            <Card className='w-[400px] bg-white dark:bg-black/20 shadow-md overflow-hidden'>
                <div className='p-6 md:-8'>
                    <CardHeader className='py-0'>
                        <CardTitle className='mb-8 text-center dark:text-white'>
                            Create Account
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <form onSubmit={handleSubmit(onSubmit)}
                              className='space-y-4'>
                            <div className='mb-8 space-y-6'>
                                <SocialAuth isLoading={loading} setIsLoading={setLoading}/>
                                <Separator/>
                                <Input disabled={loading}
                                       id='firstName'
                                       label="Name"
                                       name='firstName'
                                       type="text"
                                       placeholder="John"
                                       error={errors?.firstName?.message}
                                       {...register('firstName')}
                                       className='text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none'>

                                </Input>
                                <Input disabled={loading}
                                       id='email'
                                       label="Email"
                                       type="email"
                                       placeholder="you@example.com"
                                       error={errors?.email?.message}
                                       {...register('email')}
                                       className='text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none'>

                                </Input>
                                <Input disabled={loading}
                                       id='password'
                                       label="Password"
                                       type="password"
                                       placeholder="Your password"
                                       error={errors?.password?.message}
                                       {...register('password')}
                                       className='text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-700 dark:text-gray-400 dark:outline-none'>

                                </Input>

                                <Button type="submit"
                                        className='w-full bg-violet-800'
                                        disabled={loading}>
                                    {loading ? (<BiLoader
                                        className='text-2xl text-white animate-spin'/>) : ("Create an account")}

                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </div>
                <CardFooter className='justify-center gap-2'>
                    <p className='text-sm text-gray-600 '> Already have an account</p>
                    <Link to='/sign-in' className='text-sm font-semibold text-violet-600 hover:underline'>
                    Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
export default SignUp
