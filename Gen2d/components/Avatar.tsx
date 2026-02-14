"use client"

import { JwtUserPayload } from "@/lib/types"
import { use, useState } from "react"
import Modal from "./Modal"
import { Logout } from "@/app/actions/user"
import { redirect } from "next/navigation"

export default function ({ user }: { user: JwtUserPayload }) {

    const [open, setOpen] = useState(false)

    return <div className="font-bold text-xl z-50">
        <div onClick={() => setOpen(o => !o)} className="hover:cursor-pointer p-1">
            <div className="relative inline-flex items-center border justify-center w-10 h-10 overflow-hidden bg-neutral-tertiary rounded-full">
                <span className="font-medium text-body uppercase">{user.email[0]}</span>
            </div>
        </div>
        <Modal className="top-15 right-5 justify-self-end" open={open} onClose={async () => { }}>
            <div className="flex flex-col gap-2">
                Email: {user.email}
                <button onClick={() => {
                    Logout()
                    redirect("/auth/signin")
                }} className="bg-red-800 hover:bg-red-900 rounded py-1 hover:cursor-pointer mt-4">
                    Logout
                </button>
            </div>
        </Modal>
    </div>

}