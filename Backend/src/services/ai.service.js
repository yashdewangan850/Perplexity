import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage, AIMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import { searchInternet } from "./internet.service.js";


console.log("GEMINI_API_KEY =", process.env.GEMINI_API_KEY);
console.log("GOOGLE_API_KEY =", process.env.GOOGLE_API_KEY);



const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: process.env.GEMINI_API_KEY,
});

const searchInternetTool = tool(searchInternet, {
    name: "searchInternet",
    description: "Use this tool to get the latest information from the internet.",
    schema: z.object({
        query: z.string().describe("The search query to look up on the internet."),
    }),
});

const agent = createAgent({
    model: geminiModel,
    tools: [searchInternetTool],
});

export async function generateResponse(messages) {
    const response = await agent.invoke({
        messages: [
            new SystemMessage(`
                You are a helpful and precise assistant for answering questions.
                If you don't know the answer, say you don't know.
                If the question requires up-to-date information, use the "searchInternet" tool.
            `),
            ...messages.map((msg) => {
                if (msg.role === "user") {
                    return new HumanMessage(msg.content);
                } else {
                    return new AIMessage(msg.content);
                }
            }),
        ],
    });

    return response.messages[response.messages.length - 1].text;
}

export async function generateChatTitle(message) {
    const response = await geminiModel.invoke([
        new SystemMessage(`
            Generate a short chat title (2-4 words).
        `),
        new HumanMessage(message),
    ]);

    return response.text;
}