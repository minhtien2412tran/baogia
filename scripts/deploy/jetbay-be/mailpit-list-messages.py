import json
import urllib.request

info = json.load(urllib.request.urlopen("http://127.0.0.1:8025/api/v1/info", timeout=5))
msgs = json.load(urllib.request.urlopen("http://127.0.0.1:8025/api/v1/messages", timeout=5))
print("mailpit_version=", info.get("Version"))
print("messages_total=", msgs.get("total"))
for m in (msgs.get("messages") or [])[:5]:
    to = ",".join(a.get("Address", "") for a in (m.get("To") or []))
    print(f"subject={m.get('Subject')!r} to={to}")
