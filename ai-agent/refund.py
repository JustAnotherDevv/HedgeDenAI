import os

from portia import (
    DefaultToolRegistry,
    Portia,
    McpToolRegistry,
    Config,
)

config = Config.from_default()

tool_registry = (
    # Integrates the Stripe MCP server from 
    # https://github.com/stripe/agent-toolkit/tree/main/modelcontextprotocol
    McpToolRegistry.from_stdio_connection(
        server_name="solana-mcp",
        # "stripe",
        command="npx",
        args=[
            # "-y",
            # "@stripe/mcp",
            # "--tools=all",
            # f"--api-key={os.getenv('STRIPE_API_KEY')}",
            "-y",
            "solana-mcp",
            "-tools=all",
            f"--SOLANA_PRIVATE_KEY=jKoLMEjWA7EKGEGsPmrUprpjK5NKQvJ1K6LBwkSz3AUn7NCk3XnujBvqaNYSjwa7jRKRb6tvMedTTTKFUnRY3Rz",
            f"--RPC_URL=https://solana-devnet.g.alchemy.com/v2/-SMXAc4bfOyP0J116qY-gSPbfDdTaOOq",
            f"--OPENAI_API_KEY=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"
            ]
    )
    + DefaultToolRegistry(config)
)

portia = Portia(config=config, tools=tool_registry)

plan_run = portia.run('give me details for BONK token')

print(plan_run.model_dump_json(indent=2))