# Spec Kit (Specify) — JetBay setup

> **Installed:** Spec Kit CLI **v0.12.15** (official GitHub) · integration **`cursor-agent`** · scripts **PowerShell**  
> **Do not** install `specify-cli` from PyPI — only from [github/spec-kit](https://github.com/github/spec-kit).

## Machine install (once)

Requires [uv](https://docs.astral.sh/uv/) + Python 3.11+.

```powershell
# Persistent install (pinned release)
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@v0.12.15

# Ensure PATH (Windows)
# %USERPROFILE%\.local\bin must be on PATH
specify version
specify check
specify self check
```

Upgrade later:

```powershell
specify self upgrade
# or:
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git@vX.Y.Z
```

## This repository

Already initialized:

```text
.specify/                  # templates, workflows, constitution, manifests
.cursor/skills/speckit-*   # Cursor Agent skills
.cursor/rules/*.mdc        # JetBay rules (+ Spec Kit may add specify-rules)
```

Verify:

```powershell
cd c:\tien\tien\baogia
specify integration status
# expect: Integration status: OK · Default: cursor-agent
```

Re-init (only if broken; merges with `--force`):

```powershell
specify init --here --force --integration cursor-agent --script ps --ignore-agent-tools
```

## Cursor skills (slash)

In Cursor Agent chat / skills UI:

| Skill | Purpose |
|-------|---------|
| `/speckit-constitution` | Project principles |
| `/speckit-specify` | Write / update feature specs |
| `/speckit-plan` | Implementation plan |
| `/speckit-tasks` | Break into tasks |
| `/speckit-implement` | Execute tasks |
| `/speckit-clarify` | Optional de-risk Q&A |
| `/speckit-analyze` | Cross-artifact check |
| `/speckit-checklist` | Quality checklist |
| `/speckit-converge` | Assess gaps vs codebase |
| `/speckit-taskstoissues` | Tasks → issues |

Principles live in [`.specify/memory/constitution.md`](../.specify/memory/constitution.md) (JetBay-aligned).

## Git

- Track: `.specify/**`, `.cursor/skills/**`, `.cursor/rules/**`  
- Ignore: other `.cursor/*` local IDE junk (see root `.gitignore`)

## Notes

- Spec Kit does **not** replace `AGENTS.md` / `docs/CONTINUE_AT_HOME.md` — those remain progress SoT.  
- When templates conflict with JetBay hard rules, JetBay wins.  
- Do not claim SMTP / payment / OAuth done via Spec Kit alone — still Owner + smoke evidence.
