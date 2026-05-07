from agents.researcher import run_researcher
from agents.summarizer import run_summarizer
from agents.critic import run_critic

cases = run_researcher("murder cases of teens")
print("Researcher cases:", len(cases))
summarized = run_summarizer(cases)
print("Summarized cases:", len(summarized))
critic = run_critic(summarized, "murder cases of teens")
print("Critic cases:", len(critic))
