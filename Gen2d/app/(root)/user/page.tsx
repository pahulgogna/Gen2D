import { GetUser } from "@/app/actions/user"

export default async function() {
    let user = await GetUser()

    return <div>
        {JSON.stringify(user)}
    </div>
}