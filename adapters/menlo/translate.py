def translate_policy(policy):
    rules = []

    for script in policy["actions"]["inject_scripts"]:
        rule = {
            "name": f'{policy["name"]} – {script}',
            "conditions": policy["match"],
            "actions": {
                "inject_script": script
            },
            "priority": 100
        }
        rules.append(rule)

    return rules
