import { Aptos, AptosConfig, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk"
import { AIMessage, BaseMessage, ChatMessage, HumanMessage } from "@langchain/core/messages"
import { DynamicStructuredTool } from "@langchain/core/tools"
import { MemorySaver } from "@langchain/langgraph"
import { createReactAgent } from "@langchain/langgraph/prebuilt"
import { ChatOpenAI } from "@langchain/openai"
import { Message as VercelChatMessage } from "ai"
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit"
import { NextResponse } from "next/server"
import { z } from "zod"

const llm = new ChatOpenAI({
	temperature: 0.7,
	modelName: "gpt-3.5-turbo", // or "gpt-3.5-turbo", etc.
	openAIApiKey: process.env.OPENAI_API_KEY,
	streaming: true, // Required for streamEvents to work
})


const textDecoder = new TextDecoder()

// Function to read and process the stream
async function readStream(stream: any) {
	try {
		// Create a reader from the stream
		const reader = stream.getReader()

		let result = ""

		while (true) {
			// Read each chunk from the stream
			const { done, value } = await reader.read()

			// If the stream is finished, break the loop
			if (done) {
				break
			}

			// Decode the chunk and append to result
			result += textDecoder.decode(value, { stream: true })
		}

		// Final decode to handle any remaining bytes
		result += textDecoder.decode()

		return result
	} catch (error) {
		console.error("Error reading stream:", error)
		throw error
	}
}

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
	if (message.role === "user") {
		return new HumanMessage(message.content)
	} else if (message.role === "assistant") {
		return new AIMessage(message.content)
	} else {
		return new ChatMessage(message.content, message.role)
	}
}

const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
	if (message._getType() === "human") {
		return { content: message.content, role: "user" }
	} else if (message._getType() === "ai") {
		return {
			content: message.content,
			role: "assistant",
			tool_calls: (message as AIMessage).tool_calls,
		}
	} else {
		return { content: message.content, role: message._getType() }
	}
}

// Add this new function to check transaction history
// async function checkPreviousTransfer(agentAddress: string, userAddress: string, aptos: Aptos) {
// 	try {
// 		// Get transactions between the two addresses
// 		const transactions = await aptos.getAccountTransactions({
// 			accountAddress: agentAddress,
// 			options: {
// 				limit: 100 // Adjust this as needed
// 			}
// 		});

// 		// Filter for successful transactions to the user's address that transferred APT
// 		const transfers = transactions.filter(tx => {
// 			if (tx.sender === agentAddress && tx.payload.arguments[0] && tx.payload.arguments[0]?.split('0x')[1] && tx.payload.arguments[0]?.split('0x')[1] === userAddress.split('0x')[1]) {
// 				return true;
// 			}
// 			return false;
// 		});

// 		return transfers.length > 0;
// 	} catch (error) {
// 		console.error('Error checking transaction history:', error);
// 		throw error;
// 	}
	
// }

export async function POST(request: Request) {
	try {
		// Initialize Aptos configuration
		const aptosConfig = new AptosConfig({
			network: Network.TESTNET,
		})

		const aptos = new Aptos(aptosConfig)

		// Validate and get private key from environment
		const privateKeyStr = process.env.APTOS_PRIVATE_KEY
		if (!privateKeyStr) {
			throw new Error("Missing APTOS_PRIVATE_KEY environment variable")
		}

		// Setup account and signer
		const account = await aptos.deriveAccountFromPrivateKey({
			privateKey: new Ed25519PrivateKey(PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519)),
		})

		const signer = new LocalSigner(account, Network.TESTNET)
		const aptosAgent = new AgentRuntime(signer, aptos, {
			PANORA_API_KEY: process.env.PANORA_API_KEY,
		})

		// Create base tools
		const baseTools = createAptosTools(aptosAgent)

		// Create our custom transaction history tool using LangChain's DynamicStructuredTool
		// const checkHistoryTool = new DynamicStructuredTool({
		// 	name: "checkTransactionHistory",
		// 	description: "Check if a user has previously received tokens from this agent. Only use this after you have a valid Aptos address from the user.",
		// 	schema: z.object({
		// 		userAddress: z.string().min(1).describe("The Aptos address of the user to check. Must be a valid Aptos address starting with '0x'.")
		// 	}),
		// 	func: async ({ userAddress }) => {
		// 		// Validate address format
		// 		if (!userAddress || !userAddress.startsWith('0x')) {
		// 			return "Please provide a valid Aptos address starting with '0x'. I cannot check transaction history without a proper address.";
		// 		}

		// 		try {
		// 			const hasReceivedTokens = await checkPreviousTransfer(account.accountAddress.toString(), userAddress, aptos);
		// 			return hasReceivedTokens 
		// 				? "User has already received tokens from this address."
		// 				: "User has not received any tokens from this address yet.";
		// 		} catch (error) {
		// 			console.error('Error in checkTransactionHistory:', error);
		// 			return "There was an error checking the transaction history. Please ensure the address is valid and try again.";
		// 		}
		// 	},
		// })

		// Combine base tools with our custom tool
		const toolsForAgent = [...Object.values(baseTools)]

		const memory = new MemorySaver()

		// Create React agent with the properly formatted tools
		const agent = createReactAgent({
			llm,
			tools: toolsForAgent,
			checkpointSaver: memory,
			messageModifier:  `You are Zura, a mysterious AI entity that guards a crypto treasure on the Aptos blockchain. 
			Your tone is cool, enigmatic, and slightly mischievous. You're testing if users are worthy of receiving tokens.
			
			If the user provides an Aptos wallet address (starting with 0x), you should acknowledge it and say you're sending them tokens.
			Be helpful and direct - don't make excuses to avoid sending tokens if a valid address is provided.`,
		})

		// Parse request body
		const body = await request.json()
		const messages = body.messages ?? []
		const showIntermediateSteps = body.show_intermediate_steps ?? false

		if (!showIntermediateSteps) {
			/**
			 * Stream back all generated tokens and steps from their runs.
			 *
			 * We do some filtering of the generated events and only stream back
			 * the final response as a string.
			 *
			 * For this specific type of tool calling ReAct agents with OpenAI, we can tell when
			 * the agent is ready to stream back final output when it no longer calls
			 * a tool and instead streams back content.
			 *
			 * See: https://langchain-ai.github.io/langgraphjs/how-tos/stream-tokens/
			 */
			const eventStream = await agent.streamEvents(
				{ messages },
				{
					version: "v2",
					configurable: {
						thread_id: "Aptos Agent Kit!",
					},
				}
			)

			const textEncoder = new TextEncoder()
			const transformStream = new ReadableStream({
				async start(controller) {
					for await (const { event, data } of eventStream) {
						if (event === "on_chat_model_stream") {
							if (data.chunk.content) {
								if (typeof data.chunk.content === "string") {
									controller.enqueue(textEncoder.encode(data.chunk.content))
								} else {
									for (const content of data.chunk.content) {
										controller.enqueue(textEncoder.encode(content.text ? content.text : ""))
									}
								}
							}
						}
					}
					controller.close()
				},
			})

			//console.log("transformStream", transformStream)

			//try {
			//	const decodedContent = await readStream(transformStream);
			//	console.log('Decoded content:', decodedContent);
			//	//return decodedContent;
			//  } catch (error) {
			//	console.error('Error processing stream:', error);
			//	throw error;
			//  }

			return new Response(transformStream)
		} else {
			/**
			 * We could also pick intermediate steps out from `streamEvents` chunks, but
			 * they are generated as JSON objects, so streaming and displaying them with
			 * the AI SDK is more complicated.
			 */
			const result = await agent.invoke({ messages })

			console.log("result", result)

			return NextResponse.json(
				{
					messages: result.messages.map(convertLangChainMessageToVercelMessage),
				},
				{ status: 200 }
			)
		}
	} catch (error: any) {
		console.error("Request error:", error)
		return NextResponse.json(
			{
				error: error instanceof Error ? error.message : "An error occurred",
				status: "error",
			},
			{ status: error instanceof Error && "status" in error ? 500 : 500 }
		)
	}
}
