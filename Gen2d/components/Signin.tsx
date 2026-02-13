"use client"
import { Login } from "@/app/actions/user"
import Link from "next/link"
import { useActionState } from "react"

export default function Signin() {

    const [error, action, isLoading] = useActionState(Login, "init")

    return (
        <div className="flex overflow-y-auto overflow-x-hidden justify-center items-center w-full h-screen">
            <div className="relative p-4 w-full max-w-md max-h-full">
                <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
                    <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                        <h3 className="text-lg font-medium text-heading">
                            Sign in
                        </h3>
                    </div>
                    <form action={action} className="pt-4 md:pt-6">
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-heading">Your email</label>
                            <input name="email" type="email" id="email" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="example@company.com" required />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-heading">Your password</label>
                            <input name="password" type="password" id="password" className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body" placeholder="•••••••••" required />
                        </div>
                        <button type="submit" disabled={isLoading} className="text-white mt-5 bg-blue-700 bg-brand box-border border border-transparent hover:bg-blue-800 hover:cursor-pointer focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3">
                            {isLoading ? "loading" : "Login to your account "}
                        </button>
                        <p>Dont have an account? <Link className="text-blue-600 underline" href={"/auth/signup"}>Signup Now</Link></p>
                        {error && error != "init" && <p className="text-red-700">error: {error}</p>}
                    </form>
                </div>
            </div>
        </div>

    )
}