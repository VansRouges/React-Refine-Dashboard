import graphqlDataProvider, { 
    GraphQLClient,
    liveProvider as graphqlLiveProvider,
 } from "@refinedev/nestjs-query"
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";

export const API_BASE_URL = 'https://api.crm.refine.dev'
export const API_URL = `${API_BASE_URL}/graphql`
export const WS_URL = 'wss://api.crm.refine.dev/graphql'


export const client = new GraphQLClient(API_URL ,{
    fetch: (url: string, options: RequestInit) => {
        try {
            return fetchWrapper(url, options);
        } catch (error) {
            return Promise.reject(error as Error)
        }
    }
})

export const wsClient = typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () =>{
            const accessToken = localStorage.getItem("access_token")

            return {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            }
        }
    })
    : undefined

export const dataProvider = graphqlDataProvider(client);
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined

// Let's break down this code file together!

// Imagine you're playing with building blocks, and each block has a special job.

// This code file is like a block factory, where we create special blocks (functions and variables) to help us build a strong and cool castle (our application).

// Here's what each block does:

// 1. API_BASE_URL and API_URL: These are like the addresses of our castle's main gates. We use them to talk to the castle's guards (the server) to get or send information.

// 2. WS_URL: This is like a secret passage (web socket URL) that lets us talk to the guards in real-time, without needing to knock on the main gate every time.

// 3. client: This is like a special messenger block that helps us send messages (fetch data) to the castle guards. It uses our special fetch wrapper block (fetchWrapper) to make sure the messages are delivered safely.

// 4. wsClient: This is like a super cool, real-time messenger block that lets us talk to the guards through the secret passage (web socket). It only works if we're in a special place (the browser), and it uses our access token (like a magic password) to authenticate our messages.

// 5. dataProvider and liveProvider: These are like special blocks that help us manage our castle's resources (data) and keep everything up-to-date in real-time. They use our messenger blocks (client and wsClient) to talk to the guards and get the latest information.

// In short, this code file sets up special blocks (functions and variables) to help us communicate with our castle's guards (the server) and manage our resources (data) safely and efficiently!