"use client"

import { SignupUser } from "@/app/actions/user";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import Logo from "./Logo";

export default function Signup() {

    const [error, action, isLoading] = useActionState(SignupUser, "init")
    const router = useRouter()

    useEffect(() => {
        if (error == "") {
            // TODO: signed up message
            router.push("/auth/signin")
        }
    }, [isLoading])

    return (
        <div className="flex overflow-y-auto overflow-x-hidden justify-center items-center w-full h-full">
            <div className="relative p-4 w-full max-w-md max-h-full flex flex-col gap-20">
                <Logo className="text-8xl mt-20" size={85} />
                <div className="relative bg-neutral-primary-soft border border-default rounded-md shadow-sm p-4 md:p-6">
                    <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                        <h3 className="text-2xl font-bold text-heading">
                            Sign up
                        </h3>
                    </div>
                    <form action={action} className="pt-4 md:pt-6" >
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-2.5 text-sm font-medium text-heading">Your Name</label>
                            <input name="name" type="text" id="name" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="john doe" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-heading">Your email</label>
                            <input name="email" type="email" id="email" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="example@company.com" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-heading">password</label>
                            <input name="password" type="password" id="password" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="•••••••••" required />
                        </div>
                        <button type="submit" disabled={isLoading} className="text-white bg-blue-700 box-border border border-transparent hover:bg-blue-800 hover:cursor-pointer focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded mt-5 text-sm px-4 py-2.5 focus:outline-none w-full mb-3">
                            {isLoading ? "Creating account..." : "Create Account"}
                        </button>
                        <p>Already have an account? <Link className="text-blue-600 underline" href={"/auth/signin"}>Signin Now</Link></p>
                        {error && error != "init" && <p className="text-red-700">error: {error}</p>}
                    </form>
                </div>
            </div>
        </div>
    )
}
