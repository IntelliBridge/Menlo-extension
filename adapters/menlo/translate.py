def translate_policy(policy):
    """
    Translate abstract policy intent into Menlo-compatible structure.
    """
    return {
        "name": policy["name"],
        "conditions": policy["match"],
        "actions": policy["actions"]
    }
