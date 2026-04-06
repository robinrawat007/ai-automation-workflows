# AI Automation Workflows

2,300+ ready-to-import N8N workflow templates with a built-in browser UI.

## Structure

```
ai-automation-workflows/
├── workflows/
│   ├── hub/         ← 2,061 numbered workflows (Scheduled/Webhook/Triggered/Manual)
│   └── community/   ← 290 curated templates across 18 categories
└── web/             ← Next.js browser app (search, filter, copy/download JSON)
```

## Run the browser

```bash
cd web
npm install
npm run dev
```

Open `http://localhost:3000`

## Import a workflow into N8N

1. Find a workflow in the browser or browse `workflows/`
2. Copy or download the `.json` file
3. In N8N: `Ctrl+I` → Import from File → paste JSON
4. Configure credentials → Activate
