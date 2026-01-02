import os
import yaml
from adapters.menlo.client import MenloClient
from adapters.menlo.deploy import deploy_script, deploy_policy

ENV = "prod"

config = yaml.safe_load(
    open("config/environments.yaml")
)["environments"][ENV]

client = MenloClient(
    config["api_url"],
    os.environ[config["token_env"]]
)

# Deploy scripts
for filename in os.listdir("scripts"):
    if not filename.endswith(".js"):
        continue
    script_name = filename.replace(".js", "")
    script_content = open(f"scripts/{filename}").read()
    deploy_script(client, script_name, script_content)

# Deploy policies
for filename in os.listdir("policies"):
    if not filename.endswith(".yaml"):
        continue
    policy = yaml.safe_load(
        open(f"policies/{filename}")
    )["policy"]
    deploy_policy(client, policy)

print("✅ Adaptive Web Control Plane deployment complete.")
