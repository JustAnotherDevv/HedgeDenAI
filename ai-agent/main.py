from dotenv import load_dotenv
from portia import (
    Portia,
    default_config,
    example_tool_registry,
)

load_dotenv()

portia = Portia(tools=example_tool_registry)

plan_run = portia.run('Is current sentiment for BTC bullish or bearish? Reply with one word in UPPERCASE either BULLISH or BEARISH')

print(plan_run.model_dump_json(indent=2))