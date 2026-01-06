#!/usr/bin/env python3
"""
Adaptive Web Control Plane – Deployment Executor

Responsibilities:
- Validate configuration and metadata contracts
- Resolve environment configuration
- Enforce deployment guardrails
- Authenticate to Menlo via Vault-injected credentials
- Deploy JavaScript enforcement scripts
- Deploy policies that activate those scripts
"""

import os
import yaml

from scripts.validate_config import validate_file
from adapters.menlo.client import MenloClient
from adapters.menlo.deploy import deploy_script, deploy_policy

# ------------------------------------------------------------------
# Environment Selection
# ------------------------------------------------------------------
# MENLO_ENV controls which environment block is used from
# config/environments.yaml. Defaults to "test" for safety.
# ------------------------------------------------------------------

ENV = os.getenv("MENLO_ENV", "test")

print(f"🔧 Deploying Adaptive Web Control Plane to environment: {ENV}")

# ------------------------------------------------------------------
# Configuration Validation (Fail Fast)
# ------------------------------------------------------------------
# Ensures environments.yaml and metadata.yaml conform to schema.
# Prevents silent misconfiguration.
# ------------------------------------------------------------------

validate_file("config/environments.yaml", "schema/environments.schema.json")
validate_file("metadata/metadata.yaml", "schema/metadata.schema.json")

# ------------------------------------------------------------------
# Load Environment Configuration
# ------------------------------------------------------------------

with open("config/environments.yaml", "r") as f:
    envs = yaml.safe_load(f)

if "environments" not in envs or ENV not in envs["environments"]:
    raise RuntimeError(f"Environment '{ENV}' not defined in environments.yaml")

env_cfg = envs["environments"][ENV]

# ------------------------------------------------------------------
# Deployment Guardrails
# ------------------------------------------------------------------
# Block deployment if environment is disabled.
# This prevents accidental prod pushes.
# ------------------------------------------------------------------

if not env_cfg.get("enabled", False):
    raise RuntimeError(f"Deployment blocked: environment '{ENV}' is disabled")

# ------------------------------------------------------------------
# Vault Secret Enforcement
# ------------------------------------------------------------------
# Secrets MUST be injected via Vault (CI/CD or Vault Agent).
# No secrets are ever read from disk.
# ------------------------------------------------------------------

token = os.getenv("MENLO_API_TOKEN")
if not token:
    raise RuntimeError(
        "MENLO_API_TOKEN not injected. "
        "Ensure Vault is configured and secrets are available."
    )

# ------------------------------------------------------------------
# Menlo Client Initialization
# ------------------------------------------------------------------
# Adapter abstraction ensures vendor-specific logic is isolated.
# ------------------------------------------------------------------

client = MenloClient(
    api_url=env_cfg["api_url"],
    token=token
)

print("✅ Menlo client authenticated successfully")

# ------------------------------------------------------------------
# Optional Dry-Run Mode
# ------------------------------------------------------------------
# DRY_RUN=true causes deploy functions to log actions
# instead of executing API calls.
# ------------------------------------------------------------------

DRY_RUN = os.getenv("DRY_RUN", "false").lower() == "true"

if DRY_RUN:
    print("🟡 DRY RUN MODE ENABLED — no changes will be applied")

# ------------------------------------------------------------------
# Deploy JavaScript Enforcement Scripts
# ------------------------------------------------------------------
# These scripts perform UI injection, DLP, credential protection,
# and contextual enforcement inside the Menlo Secure Browser.
# ------------------------------------------------------------------

scripts_dir = "scripts"

for filename in sorted(os.listdir(scripts_dir)):
    if not filename.endswith(".js"):
        continue

    script_name = filename.replace(".js", "")
    script_path = os.path.join(scripts_dir, filename)

    with open(script_path, "r") as f:
        script_content = f.read()

    print(f"➡️  Deploying script: {script_name}")

    if not DRY_RUN:
        deploy_script(client, script_name, script_content)

# ------------------------------------------------------------------
# Deploy Policies (Metadata-Driven)
# ------------------------------------------------------------------
# Policies activate scripts based on metadata attributes such as:
# - user_group
# - device_trust
# - geo_risk
# ------------------------------------------------------------------

policies_dir = "policies"

for filename in sorted(os.listdir(policies_dir)):
    if not filename.endswith(".yaml"):
        continue

    with open(os.path.join(policies_dir, filename), "r") as f:
        policy = yaml.safe_load(f)["policy"]

    print(f"➡️  Deploying policy: {policy['name']}")

    if not DRY_RUN:
        deploy_policy(client, policy)

print("🎉 Adaptive Web Control Plane deployment complete")
