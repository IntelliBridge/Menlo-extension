import requests

class MenloClient:
    def __init__(self, api_url, token):
        self.base = api_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        })

    def post(self, path, payload):
        resp = self.session.post(
            f"{self.base}{path}",
            json=payload,
            timeout=30
        )
        resp.raise_for_status()
        return resp.json()
