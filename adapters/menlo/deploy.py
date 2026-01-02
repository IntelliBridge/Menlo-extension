from .translate import translate_policy

def deploy_script(client, script_name, script_content):
    payload = {
        "name": script_name,
        "type": "javascript",
        "timing": "on_page_load",
        "context": "main_frame",
        "content": script_content
    }
    client.post("/script-injection", payload)

def deploy_policy(client, policy):
    payload = translate_policy(policy)
    client.post("/policies", payload)
