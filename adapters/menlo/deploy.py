from .translate import translate_policy

def deploy_script(client, name, content):
    payload = {
        "name": name,
        "type": "javascript",
        "execution": "on_page_load",
        "context": "main_frame",
        "content": content
    }
    client.post("/api/v1/script-injections", payload)


def deploy_policy(client, policy):
    rules = translate_policy(policy)
    for rule in rules:
        client.post("/api/v1/policies/web", rule)
