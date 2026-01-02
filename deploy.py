import os
import yaml
from adapters.menlo.client import MenloClient
from adapters.menlo.deploy import deploy_script, deploy_policy

ENV = "prod"

# Load configs
envs = yaml.safe_load(open("config/environments.yaml"))
vault = yaml.safe_load(open("config/vault.yaml"))

env_cfg = envs["environments"][ENV]
vault_key = env_cfg["vault_path"].split(".")

token = vault[vault_key[0]][vault_key[1]]["api_token"]

client = MenloClient(
    api_url=env_cfg["api_url"],
    token=token
)

# Deploy scripts
for filename in sorted(open("scripts").read().split()):
    if filename.endswith(".js"):
        name = filename.replace(".js", "")
        content = open(f"scripts/{filename}").read()
        deploy_script(client, name, content)

# Deploy policies
for filename in sorted(open("policies").read().split()):
    if filename.endswith(".yaml"):
        policy = yaml.safe_load(open(f"policies/{filename}"))["policy"]
        deploy_policy(client, policy)

print("✅ Deployment completed successfully")
print("✅ Adaptive Web Control Plane deployment complete.")
