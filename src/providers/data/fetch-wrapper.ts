import { GraphQLFormattedError } from "graphql"

type Error = {
    message: string;
    statusCode: string;
}

const customFetch = async (url: string, options: RequestInit) => {
    const accessToken = localStorage.getItem('access_token');

    const headers = options.headers as Record<string, string>;

    return await fetch(url, {
        ...options,
        headers: {
            ...headers,
            Authorization: headers?.Authorization || `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "Apollo-Require-Preflight": "true", 
        }
    })
}

const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined>): Error | null => {
    if(!body){
        return {
            message: 'Unknown error',
            statusCode: "INTERNAL_SERVER_ERROR"
        }
    }

    if("errors" in body){
        const errors = body?.errors;

        const messages = errors?.map((error) => error?.message)?.join("");
        const code = errors?.[0]?.extensions?.code;
        
        return {
            message: messages || JSON.stringify(errors),
            statusCode: code || 500
        }
    }

    return null
}

export const fetchWrapper = async (url: string, options: RequestInit) => {
    const response = await customFetch(url, options);

    const responseClone = response.clone();
    const body = await responseClone.json();

    const error = getGraphQLErrors(body);

    if(error){
        throw error;
    }

    return response;
}

// Let's break down this code file together!

// Imagine you're sending a letter to a friend. You need to put the letter in an envelope, write the address, and give it to a mail carrier (like a fetch function). But, sometimes, the mail carrier might return a special message saying there's a problem (like an error).

// This code file has three main parts:

// 1. Custom Fetch: This is like a special mail carrier that adds a secret password (access token) to the envelope (headers) before sending the letter (fetching data). It also sets some other important details like the content type and a special flag for Apollo (a tool for working with data).

// 2. Get GraphQL Errors: This is like a detective who looks at the special message (error) returned by the mail carrier. If there's a problem, the detective tries to find the error messages and codes inside the message. If they can't find any, they create a default message.

// 3. Fetch Wrapper: This is like a helper who uses the special mail carrier (customFetch) to send the letter (fetch data). They also make a copy of the response (responseClone) to examine it. If the detective (getGraphQLErrors) finds any errors, the helper throws the error message. Otherwise, they return the original response.

// In short, this code file helps handle errors and data fetching in a special way, using a custom fetch function and error detective to make sure things run smoothly!