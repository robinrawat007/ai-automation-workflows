# AI Automation Workflows

A curated collection of **2,300+ ready-to-import N8N workflow templates** plus utility scripts and infrastructure configs for running your own automation platform.

---

## How to Use Any Workflow

1. Find a `.json` file in `workflows/hub/` or `workflows/community/`
2. Open your N8N dashboard
3. Go to **Workflows → Import from File** (or press `Ctrl/Cmd + I`)
4. Select the JSON file
5. Configure credentials and activate

---

## Collections

### `workflows/hub/` — 2,061 workflows

Numbered workflows (`0001_` to `9004_`) covering every major integration. Naming pattern:
`NNNN_[Service1]_[Service2]_[Action]_[TriggerType].json`

### `workflows/community/` — 280+ workflows

Curated templates organized into 18 categories:

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

---

## Repository Structure

```
ai-automation-workflows/
├── README.md
├── .gitignore
├── workflows/
│   ├── hub/                ← 2,061 numbered workflow JSONs
│   │   └── README.md
│   └── community/          ← 280+ categorized workflow JSONs
│       ├── README.md
│       └── [18 category folders]/
├── scripts/                ← utility scripts (Python, JS, shell)
│   ├── src/                ← application source (API server, analytics, etc.)
│   ├── api_server.py
│   ├── import_workflows.py
│   ├── workflow_db.py
│   ├── run.py
│   ├── requirements.txt
│   └── ...
├── infra/                  ← Docker, Kubernetes, Helm configs
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── k8s/
│   └── helm/
├── docs/                   ← documentation and guides
│   ├── n8n_syntax_manual.txt
│   ├── ai-stack/
│   └── context/
└── assets/                 ← static files and images
    ├── img/n8n.png
    └── web/
```
