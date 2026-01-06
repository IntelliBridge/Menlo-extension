import os
import yaml
from adapters.menlo.client import MenloClient
from adapters.menlo.deploy import deploy_script, deploy_policy

# ------------------------------------------------------------------
# Environment selection (CI/CD safe)
# ------------------------------------------------------------------

ENV = os.getenv("MENLO_ENV", "dev")

# ------------------------------------------------------------------
# Load environment configuration (non-secret)
# ------------------------------------------------------------------

with open("config/environments.yaml") as f:
    envs = yaml.safe_load(f)

env_cfg = envs["environments"][ENV]

# ------------------------------------------------------------------
# Load secrets from Vault (via env var or agent)
# ------------------------------------------------------------------
# Vault agent or CI injects this
# NEVER read secrets from files in prod

token = os.getenv("MENLO_API_TOKEN")
if not token:
    raise RuntimeError("MENLO_API_TOKEN not set")

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
# Deploy policies (metadata-driven)
# ------------------------------------------------------------------

policies_dir = "policies"

for filename in sorted(os.listdir(policies_dir)):
    if not filename.endswith(".yaml"):
        continue

    with open(os.path.join(policies_dir, filename)) as f:
        policy_doc = yaml.safe_load(f)

    policy = policy_doc["policy"]

    # Optional guardrail: metadata validation
    if "conditions" not in policy:
        raise ValueError(f"Policy {policy['name']} missing conditions")

    print(f"Deploying policy: {policy['name']}")
    deploy_policy(client, policy)

print("✅ Adaptive Web Control Plane deployment complete")
