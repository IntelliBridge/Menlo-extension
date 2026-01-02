import requests

class MenloClient:
    def __init__(self, api_url, token):
        self.api_url = api_url.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

    def post(self, path, payload):
        response = requests.post(
            f"{self.api_url}{path}",
            headers=self.headers,
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        return response.json()
