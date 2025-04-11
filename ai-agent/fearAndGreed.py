from dotenv import load_dotenv
from portia import (
    Portia,
    default_config,
    example_tool_registry,
)

load_dotenv()

portia = Portia(tools=example_tool_registry)

plan_run = portia.run('Is current fear and greed index for cryptocurrency in general? Reply with just one extracted number representing fear and greed index value without any additional text')

print(plan_run.model_dump_json(indent=2))