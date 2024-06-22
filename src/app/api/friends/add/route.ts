import { authOptions } from "@/lib/auth"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"

export async function POST(req:Request){
    try {
        const body = await req.json()
        const {email: emailToAdd} = addFriendValidator.parse(body.email)
        const RestResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_UR}/get/user:email${emailToAdd}`,{headers:{Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`}, cache:'no-store'})

        const data = (await RestResponse.json()) as {result: string}
        const idToAdd = data.result
        const session = getServerSession(authOptions)
    } catch (error) {
        
    }
}