from pathlib import Path

text = Path("/var/www/jetbay-be/.env").read_text(errors="replace")
keys = {
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM",
    "SMTP_ENQUIRY_TO",
    "SWAGGER_BASIC_USER",
    "SWAGGER_BASIC_PASSWORD",
    "STRIPE_SECRET_KEY",
    "GOOGLE_CLIENT_ID",
    "TWILIO_ACCOUNT_SID",
}
loop = {"localhost", "127.0.0.1", "0.0.0.0", "::1", "host.docker.internal"}
found = {k: "NOT_SET" for k in keys}
for line in text.splitlines():
    if not line or line.startswith("#") or "=" not in line:
        continue
    k, v = line.split("=", 1)
    if k not in keys:
        continue
    vv = v.strip().strip('"').strip("'")
    if "PASS" in k or "SECRET" in k or "PASSWORD" in k:
        found[k] = "SET" if vv else "NOT_SET"
    elif k == "SMTP_HOST":
        low = vv.lower()
        if not vv:
            found[k] = "NOT_SET"
        elif low in loop or low.endswith(".local"):
            found[k] = "LOOPBACK"
        else:
            found[k] = "READY"
    else:
        found[k] = "SET" if vv else "NOT_SET"
for k in sorted(found):
    print(f"{k}={found[k]}")
