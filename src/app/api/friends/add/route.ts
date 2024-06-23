import { authOptions } from "@/lib/auth"
import { addFriendValidator } from "@/lib/validations/add-friend"
import { getServerSession } from "next-auth"

export async function POST(req:Request){
    try {
        const body = await req.json()
        const {email: emailToAdd} = addFriendValidator.parse(body.email)
        const RestResponse = await fetch(`${process.env.UPSTASH_REDIS_REST_UR}/get/user:email${emailToAdd}`,{headers:{Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`}, cache:'no-store'})

        const data = (await RestResponse.json()) as {result: string|null}
        const idToAdd = data.result
        if(!idToAdd){
            return new Response('This person does not exist')
        }
        const session = await getServerSession(authOptions)
        if(!session){
            return new Response('Unauthorised',{status:401})
        }
        if(idToAdd===session.user.id){
            return new Response('You cannot add yourself you goof!!',{status:400})
        }
    } catch (error) {
        
    }
}