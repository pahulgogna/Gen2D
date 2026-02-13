"use client"

import { JwtUserPayload } from "@/lib/types"
import { useState } from "react"
import Modal from "./Modal"
import { Logout } from "@/app/actions/user"
import { redirect } from "next/navigation"

export default function ({ user }: { user: JwtUserPayload }) {

    const [open, setOpen] = useState(false)

    return <div className="font-bold text-xl z-50">
        <div onClick={() => setOpen(o => !o)} className="hover:cursor-pointer p-1">
            {user.email[0]}
        </div>
        <Modal open={open} onClose={async () => { }}>
            <div className="flex flex-col gap-2">
                Email: {user.email}
                <button onClick={() => {
                    Logout()
                    redirect("/auth/signin")
                }} className="bg-red-500 rounded py-1 hover:cursor-pointer mt-4">
                    Logout
                </button>
            </div>
        </Modal>
    </div>

}