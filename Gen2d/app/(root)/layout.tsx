import { verifyJWT } from "../actions/auth/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    let user = await verifyJWT()
    if (!user) {
        redirect("/auth/signin")
    }
    return (
        <div>
            {children}
        </div>
    );
}
