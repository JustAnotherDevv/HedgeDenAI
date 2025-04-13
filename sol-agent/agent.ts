import { SolanaAgentKit, createSolanaTools } from "solana-agent-kit";
import { HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI } from "@langchain/openai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import * as dotenv from "dotenv";

dotenv.config();

async function initializeAgent() {
  const llm = new ChatOpenAI({
    temperature: 0.7,
  });

  console.log(
    process.env.SOLANA_PRIVATE_KEY,
    process.env.RPC_URL,
    process.env.OPENAI_API_KEY
  );

  const solanaKit = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
    process.env.RPC_URL,
    process.env.OPENAI_API_KEY!
  );

  const tools = createSolanaTools(solanaKit);
  const memory = new MemorySaver();
  const config = { configurable: { thread_id: "Solana Agent Kit!" } };

  return createReactAgent({
    llm,
    tools,
    checkpointSaver: memory,
  });
}

async function runChat() {
  const agent = await initializeAgent();
  const config = { configurable: { thread_id: "Solana Agent Kit!1" } };

  const stream = await agent.stream(
    {
      messages: [new HumanMessage("Give me current SOL mainnet price in usd")],
    },
    config
  );

  for await (const chunk of stream) {
    if ("agent" in chunk) {
      console.log(chunk.agent.messages[0].content);
    } else if ("tools" in chunk) {
      console.log(chunk.tools.messages[0].content);
    }
    console.log("-------------------");
  }
}

runChat().catch(console.error);
