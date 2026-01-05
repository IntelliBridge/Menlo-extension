Adaptive Web Control Plane
Overview:

The Adaptive Web Control Plane is a vendor-agnostic, policy-driven framework for enforcing DoD-aligned web usage controls using browser isolation platforms
(currently Menlo Security).

Currently, the control plane enables:

  1. AI usage warnings

  2. Data redaction and inline DLP

  3. Credential protection

  4. Social media posting controls

  5. Geographic risk awareness

All enforcement is applied without browser extensions, endpoint agents, or user configuration changes.

Architecture Summary:

This system is intentionally split into four layers:

  1. Policy Intent (YAML)

  2. Enforcement Logic (JavaScript)

  3. Vendor Adapter (Menlo)

  4. Automated Control Plane (deploy.py)

This separation allows the same policies and scripts to be reused across on-prem, hybrid, or cloud deployments, and across multiple vendors.


How the System Works: (End-to-End)
  1. Policy Definition

  Policies are defined in YAML under policies/.

Example:

policy:
  name: High-Risk Geography Warning
  match:
    geo_risk: high
  actions:
    inject_scripts:
      - geo-risk-ui.inject


  Policies define intent only:

  When something applies

  What enforcement should occur

  They do not contain vendor syntax.

  2. Script Enforcement

  Scripts under scripts/ are pure JavaScript that run inside the isolated browser DOM.

  They:

  1. display DoD-aligned warnings

  2. redact sensitive data

  3. block risky behavior

  4. emit telemetry signals

  They do not:

  - send network traffic

  - store data

  - use browser extensions

  - require persistent state

  This makes them compatible with Menlo and similar platforms.

  3. Telemetry Model

  Injected scripts do not send telemetry themselves.

  Instead, they:

  set DOM attributes (e.g. data-dod-ai-warning="displayed")

  emit console.warn() messages

  Menlo:

  observes script execution

  correlates DOM + console signals

  links events to policy, user, and session

  This model:

  preserves isolation

  avoids data exfiltration

  aligns with RMF constraints

  4. Vendor Adapter (Menlo)

  The Menlo adapter:

  translates abstract policies into Menlo rules

  uploads JavaScript injection scripts

  binds scripts to policies

  All Menlo-specific logic is contained in:

  adapters/menlo/


  This allows future adapters (e.g. Zscaler, Island) without changing policies or scripts.

5. Secrets Handling

Secrets are never hard-coded.

config/vault.yaml contains API tokens and is excluded from Git.

Example:

menlo:
  prod:
    api_token: "REDACTED"


The control plane reads secrets only at runtime.

Deployment Flow:

Running a Deployment

python3 deploy.py

What Happens:

Configuration is loaded

Secrets are read from the vault

All JavaScript files are uploaded to Menlo

All policy YAMLs are translated into Menlo rules

Policies activate script injection

No users are interrupted.
No browsers are restarted.
No endpoint changes occur.

Runtime Behavior (What Users Experience)

When a user browses:

Traffic is routed through Menlo isolation

Menlo evaluates policies

Matching policies inject scripts

Scripts execute inside the isolated DOM

Warnings, redaction, or blocking occur in real time

All enforcement is session-scoped and policy-driven.

Rollback & Updates:

Updating scripts affects new sessions only

Updating policies affects new sessions only

Removing a policy immediately disables enforcement

Re-running deployment is safe

This enables zero-downtime updates.

Requirements & Assumptions:
Required

Menlo Security tenant with script injection enabled

API access to Menlo

Python 3.x

Menlo Configuration Dependencies

Policies must inject metadata attributes such as:

data-cocom="EUCOM"
data-geo-risk="high"
data-country-code="CN"


Scripts safely fall back to defaults if metadata is not present.

Security & Compliance Notes

No user data is exfiltrated

No content classification is asserted

Messaging is advisory and DoD-aligned

Enforcement is transparent and auditable

This design supports:

ATO review

Least-privilege principles

Extensibility:

You can safely:

  - add new scripts

  - add new policies

  - add new environments

  - add new vendor adapters

No refactoring required.

Summary:

This project provides a portable, policy-driven, secure control plane for adaptive web enforcement using browser isolation. It cleanly separates intent, enforcement,
and execution, making it suitable for enterprise and DoD environments across on-prem, hybrid, and cloud deployments.
