# AI Automation Workflows

A curated collection of **2,300+ ready-to-import N8N workflow templates** covering AI, automation, and third-party integrations. All workflows are JSON files that can be imported directly into any N8N instance.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![License: CC-BY-4.0](https://img.shields.io/badge/License-CC--BY--4.0-blue.svg)](LICENSE)
[![Workflows](https://img.shields.io/badge/workflows-2300+-orange)](workflows/)

---

## What is N8N?

[N8N](https://n8n.io/) is an open-source workflow automation platform — a self-hostable alternative to Zapier/Make. It supports 400+ integrations and has built-in support for AI services like OpenAI, Claude, Gemini, and LangChain.

---

## How to Use Any Workflow

1. Find a `.json` file in the `workflows/` folder
2. Open your N8N dashboard
3. Go to **Workflows → Import from File** (or press `Ctrl/Cmd + I`)
4. Select the JSON file
5. Configure credentials for each connected service
6. Activate and run

---

## Collections

### 1. AI Workflow Hub — `workflows/hub/` (2,055 workflows)

2,000+ N8N AI automation workflows from [alegoai.com](https://www.alegoai.com/) by **Emre Taş**.

Workflows follow the naming pattern `NNNN_[Service1]_[Service2]_[Action]_[TriggerType].json`.

Trigger types: `Scheduled`, `Triggered`, `Webhook`, `Monitor`

See [`workflows/hub/README.md`](workflows/hub/README.md) for the full guide.

---

### 2. Community Templates — `workflows/community/` (280+ workflows)

Curated community templates from [github.com/enescingoz/awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates) by **Enes Cingoz**, organized into 18 categories.

| Category | Folder |
|---|---|
| AI Research, RAG & Data Analysis | `AI_Research_RAG_and_Data_Analysis/` |
| Airtable | `Airtable/` |
| Database & Storage | `Database_and_Storage/` |
| DevOps | `devops/` |
| Discord | `Discord/` |
| Forms & Surveys | `Forms_and_Surveys/` |
| Gmail & Email Automation | `Gmail_and_Email_Automation/` |
| Google Drive & Sheets | `Google_Drive_and_Google_Sheets/` |
| HR & Recruitment | `HR_and_Recruitment/` |
| Instagram, Twitter & Social Media | `Instagram_Twitter_Social_Media/` |
| Notion | `Notion/` |
| OpenAI & LLMs | `OpenAI_and_LLMs/` |
| Other Integrations | `Other_Integrations_and_Use_Cases/` |
| PDF & Document Processing | `PDF_and_Document_Processing/` |
| Slack | `Slack/` |
| Telegram | `Telegram/` |
| WhatsApp | `WhatsApp/` |
| WordPress | `WordPress/` |

See [`workflows/community/README.md`](workflows/community/README.md) for the full template listing.

---

## Repository Structure

```
ai-automation-workflows/
├── README.md               ← this file
├── ATTRIBUTION.md          ← source credits
├── LICENSE                 ← CC-BY-4.0
├── .gitignore
├── workflows/
│   ├── hub/                ← 2,055 workflows from alegoai.com (MIT)
│   │   ├── README.md
│   │   └── [NNNN_Service_Action_Trigger.json ...]
│   └── community/          ← 280+ curated templates (CC-BY-4.0)
│       ├── README.md
│       └── [18 category folders]/
├── docs/
│   └── llms.txt
└── assets/
    └── img/
        └── n8n.png
```

---

## Attribution & Licenses

| Collection | Author | Source | License |
|---|---|---|---|
| AI Workflow Hub | Emre Taş | [alegoai.com](https://www.alegoai.com/) | MIT |
| Awesome n8n Templates | Enes Cingoz | [github.com/enescingoz/awesome-n8n-templates](https://github.com/enescingoz/awesome-n8n-templates) | CC-BY-4.0 |

See [ATTRIBUTION.md](ATTRIBUTION.md) for full attribution details.
