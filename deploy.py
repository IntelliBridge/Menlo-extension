import os
import yaml
from adapters.menlo.client import MenloClient
from adapters.menlo.deploy import deploy_script, deploy_policy

ENV = "prod"

# ------------------------------------------------------------------
# Load configuration
# ------------------------------------------------------------------

with open("config/environments.yaml") as f:
    envs = yaml.safe_load(f)

with open("config/vault.yaml") as f:
    vault = yaml.safe_load(f)

env_cfg = envs["environments"][ENV]
vault_root, vault_env = env_cfg["vault_path"].split(".")

token = vault[vault_root][vault_env]["api_token"]

client = MenloClient(
    api_url=env_cfg["api_url"],
    token=token
)

# ------------------------------------------------------------------
# Deploy ALL JavaScript injection scripts
# ------------------------------------------------------------------

scripts_dir = "scripts"

for filename in sorted(os.listdir(scripts_dir)):
    if not filename.endswith(".js"):
        continue

    script_name = filename.replace(".js", "")
    script_path = os.path.join(scripts_dir, filename)

    with open(script_path, "r") as f:
        script_content = f.read()

    print(f"Deploying script: {script_name}")
    deploy_script(client, script_name, script_content)

# ------------------------------------------------------------------
# Deploy policies (which activate scripts)
# ------------------------------------------------------------------

policies_dir = "policies"

for filename in sorted(os.listdir(policies_dir)):
    if not filename.endswith(".yaml"):
        continue

    with open(os.path.join(policies_dir, filename)) as f:
        policy = yaml.safe_load(f)["policy"]

    print(f"Deploying policy: {policy['name']}")
    deploy_policy(client, policy)

print("✅ Adaptive Web Control Plane deployment complete")
