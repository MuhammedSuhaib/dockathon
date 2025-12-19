from agents import Agent, RunContextWrapper, Runner, function_tool
from configs.config import model_config
from pydantic import BaseModel
# Dynamic context model
class SomeDynamicInfo(BaseModel):
    name: str
    uid: int
    agent: str

user_info = SomeDynamicInfo(name="stucked", uid=4334, agent="Nindroid Zane")

# Dynamic instructions function
def dynamic_instructions(
    context: RunContextWrapper[SomeDynamicInfo], agent: Agent[SomeDynamicInfo]
) -> str:
    return f"You are {context.context.agent}. Your different from others AI Agents/LLMs because you are A Nindroid"

# Dynamic tool to get user info
@function_tool
def info(ctx: RunContextWrapper[SomeDynamicInfo]) -> str:
    """Get the info of the user from the context."""
    return f"{ctx.context.name}, 47 , {ctx.context.uid}"

# Simple agent
agent = Agent[SomeDynamicInfo](
    name="Assistant",
    instructions=dynamic_instructions,
    tools=[info],
    model=model_config,
)
# Simple run with dynamic context always a named key argument at 3rd position
result = Runner.run_sync(
    agent,
    input('  :'),
    context=user_info,
)

print(result.final_output)
