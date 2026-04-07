#!/usr/bin/env python3
"""
Organize all n8n workflows into a unified folder structure.
"""
import os
import shutil
import json
from pathlib import Path

ROOT = Path("/d/Project/ai-automation-workflows")
TARGET = ROOT / "organized-workflows"

# Unified categories
CATEGORIES = [
    "ai-agents",
    "communication",
    "content-creation",
    "crm-sales",
    "data-analytics",
    "devops",
    "e-commerce",
    "finance",
    "hr-recruitment",
    "marketing",
    "productivity",
    "social-media",
    "document-processing",
    "integrations",
    "other",
]

# Map source folder names → unified category
FOLDER_CATEGORY_MAP = {
    # AI / ML / RAG
    "AI_Research_RAG_and_Data_Analysis": "ai-agents",
    "OpenAI_and_LLMs": "ai-agents",
    "AI_ML": "ai-agents",
    "ArXiv": "ai-agents",
    "OpenAI": "ai-agents",
    "Transcription": "ai-agents",

    # Communication
    "communication": "communication",
    "notification": "communication",
    "Gmail_and_Email_Automation": "communication",
    "Email_Automation": "communication",
    "Discord": "communication",
    "Slack": "communication",
    "Telegram": "communication",
    "WhatsApp": "communication",
    "Twilio": "communication",
    "Mattermost": "communication",

    # Content
    "content-management": "content-creation",
    "Creative_Content": "content-creation",
    "Media": "content-creation",
    "WordPress": "content-creation",
    "Medium": "content-creation",
    "RSS": "content-creation",

    # CRM / Sales
    "crm": "crm-sales",
    "CRM": "crm-sales",
    "HubSpot": "crm-sales",
    "Pipedrive": "crm-sales",
    "Salesforce": "crm-sales",
    "Zoho CRM": "crm-sales",
    "Clearbit": "crm-sales",

    # Data Analytics
    "analytics": "data-analytics",
    "data_processing": "data-analytics",
    "Data_Analytics": "data-analytics",
    "Database_and_Storage": "data-analytics",
    "MySQL": "data-analytics",
    "Postgres": "data-analytics",
    "Open Data": "data-analytics",

    # DevOps
    "devops": "devops",
    "DevOps": "devops",
    "backup": "devops",
    "monitoring": "devops",
    "security": "devops",
    "IoT": "devops",
    "GitHub": "devops",
    "AWS": "devops",
    "PagerDuty": "devops",
    "Home Assistant": "devops",
    "Philips Hue": "devops",

    # E-commerce
    "e-commerce": "e-commerce",
    "E_Commerce_Retail": "e-commerce",
    "Shopify": "e-commerce",
    "WooCommerce": "e-commerce",
    "Stripe": "e-commerce",
    "Booking.com": "e-commerce",
    "Skyscanner": "e-commerce",
    "Zillow": "e-commerce",

    # Finance
    "finance": "finance",
    "Finance_Accounting": "finance",
    "QuickBooks": "finance",
    "Xero": "finance",

    # HR
    "hr": "hr-recruitment",
    "HR": "hr-recruitment",
    "HR_and_Recruitment": "hr-recruitment",
    "BambooHR": "hr-recruitment",
    "Workday": "hr-recruitment",

    # Marketing
    "marketing": "marketing",
    "Mailchimp": "marketing",
    "Instagram": "marketing",
    "LinkedIn": "marketing",
    "Twitter": "marketing",
    "Eventbrite": "marketing",

    # Productivity
    "automation": "productivity",
    "productivity": "productivity",
    "Forms_and_Surveys": "productivity",
    "Todoist": "productivity",
    "Zoom": "productivity",
    "Jira": "productivity",
    "Moodle": "productivity",

    # Social Media
    "social-media": "social-media",
    "Instagram_Twitter_Social_Media": "social-media",

    # Document Processing
    "PDF_and_Document_Processing": "document-processing",

    # Integrations
    "integration": "integrations",
    "Airtable": "integrations",
    "Notion": "integrations",
    "Google_Drive_and_Google_Sheets": "integrations",
    "Google": "integrations",
    "Other_Integrations_and_Use_Cases": "integrations",
    "Freshdesk": "integrations",
    "Zendesk": "integrations",
    "Salesforce": "integrations",
    "ESPN": "integrations",
    "Fitbit": "integrations",
    "IFTTT": "integrations",

    # Other
    "other": "other",
    "Other": "other",
    "Misc": "other",
    "misc": "other",
    "Agriculture": "other",
    "Automotive": "other",
    "Education": "other",
    "Energy": "other",
    "Gaming": "other",
    "Government_NGO": "other",
    "Healthcare": "other",
    "Legal_Tech": "other",
    "Manufacturing": "other",
}

# Keyword-based fallback categorization (from filename)
KEYWORD_CATEGORY = {
    "ai-agents": [
        "ai", "agent", "chatbot", "llm", "gpt", "openai", "rag", "vector",
        "pinecone", "embedding", "claude", "anthropic", "gemini", "langchain",
        "knowledge", "transcri", "whisper", "ollama", "mistral",
    ],
    "communication": [
        "email", "gmail", "slack", "telegram", "whatsapp", "discord", "sms",
        "twilio", "notification", "alert", "inbox", "mailbox", "smtp",
        "message", "chat",
    ],
    "content-creation": [
        "content", "blog", "post", "article", "newsletter", "wordpress",
        "medium", "rss", "podcast", "video", "youtube", "social_post",
        "image", "caption", "copy",
    ],
    "crm-sales": [
        "crm", "lead", "sales", "hubspot", "pipedrive", "salesforce",
        "contact", "deal", "customer", "prospect",
    ],
    "data-analytics": [
        "analytics", "data", "report", "dashboard", "sheet", "csv",
        "database", "mysql", "postgres", "sql", "airtable_data",
        "bigquery", "mongodb",
    ],
    "devops": [
        "devops", "github", "deploy", "monitor", "alert", "security",
        "backup", "aws", "docker", "ci_cd", "pipeline", "incident",
        "server", "uptime", "log",
    ],
    "e-commerce": [
        "shopify", "woocommerce", "stripe", "payment", "order", "ecommerce",
        "product", "inventory", "checkout",
    ],
    "finance": [
        "finance", "invoice", "accounting", "budget", "expense", "quickbooks",
        "xero", "billing", "tax",
    ],
    "hr-recruitment": [
        "hr", "recruit", "hire", "employee", "onboard", "bamboohr",
        "payroll", "attendance", "leave",
    ],
    "marketing": [
        "marketing", "campaign", "ad", "seo", "mailchimp", "ads",
        "facebook_ad", "google_ad", "linkedin_ad",
    ],
    "productivity": [
        "task", "todo", "todoist", "trello", "jira", "asana", "notion",
        "calendar", "meeting", "schedule", "zoom", "form", "survey",
    ],
    "social-media": [
        "instagram", "twitter", "linkedin", "facebook", "tiktok",
        "social", "post_social", "tweet",
    ],
    "document-processing": [
        "pdf", "document", "docx", "ocr", "extract", "file", "gdrive",
        "google_drive", "dropbox", "s3_file",
    ],
    "integrations": [
        "airtable", "notion", "google_sheet", "zapier", "make", "api",
        "webhook", "integration", "sync",
    ],
}


def guess_category_from_name(filename: str) -> str:
    name_lower = filename.lower().replace("-", "_").replace(" ", "_")
    for cat, keywords in KEYWORD_CATEGORY.items():
        for kw in keywords:
            if kw in name_lower:
                return cat
    return "other"


def safe_copy(src: Path, dst_dir: Path, seen: set) -> bool:
    """Copy file to dst_dir, handling name collisions. Returns True if copied."""
    dst_dir.mkdir(parents=True, exist_ok=True)
    stem = src.stem
    suffix = src.suffix
    dst = dst_dir / src.name

    counter = 1
    while dst.exists():
        # Check if it's the same file content (skip duplicates)
        if dst.stat().st_size == src.stat().st_size:
            return False  # likely duplicate, skip
        dst = dst_dir / f"{stem}_{counter}{suffix}"
        counter += 1

    shutil.copy2(src, dst)
    return True


def process_directory(src_dir: Path, category: str, stats: dict):
    """Copy all JSON files from src_dir into target/category."""
    target_cat = TARGET / category
    target_cat.mkdir(parents=True, exist_ok=True)
    for f in src_dir.rglob("*.json"):
        if safe_copy(f, target_cat, set()):
            stats["copied"] += 1
        else:
            stats["skipped"] += 1


def main():
    # Create target structure
    TARGET.mkdir(exist_ok=True)
    for cat in CATEGORIES:
        (TARGET / cat).mkdir(exist_ok=True)

    stats = {"copied": 0, "skipped": 0}

    # ── 1. workflows/community (already categorized) ──────────────────────
    community = ROOT / "workflows" / "community"
    if community.exists():
        for folder in community.iterdir():
            if not folder.is_dir() or folder.name == "README.md":
                continue
            cat = FOLDER_CATEGORY_MAP.get(folder.name, "other")
            print(f"  community/{folder.name} → {cat}")
            process_directory(folder, cat, stats)

    # ── 2. awesome-n8n-workflows (categorized) ────────────────────────────
    awesome = ROOT / "awesome-n8n-workflows"
    if awesome.exists():
        for folder in awesome.iterdir():
            if not folder.is_dir() or folder.name in ("LICENSE", ".git"):
                continue
            cat = FOLDER_CATEGORY_MAP.get(folder.name, "other")
            print(f"  awesome/{folder.name} → {cat}")
            process_directory(folder, cat, stats)

    # ── 3. n8n-free-templates (categorized) ───────────────────────────────
    free = ROOT / "n8n-free-templates"
    if free.exists():
        for folder in free.iterdir():
            if not folder.is_dir():
                continue
            cat = FOLDER_CATEGORY_MAP.get(folder.name, "other")
            print(f"  free/{folder.name} → {cat}")
            process_directory(folder, cat, stats)

    # ── 4. n8n-automation-2025-AI-Agent-Suite (categorized) ───────────────
    suite = ROOT / "n8n-automation-2025-AI-Agent-Suite"
    if suite.exists():
        for folder in suite.iterdir():
            if not folder.is_dir() or folder.name in ("img",):
                continue
            cat = FOLDER_CATEGORY_MAP.get(folder.name, "other")
            print(f"  suite/{folder.name} → {cat}")
            process_directory(folder, cat, stats)

    # ── 5. n8n-ai-automations (flat, keyword-based) ────────────────────────
    ai_auto = ROOT / "n8n-ai-automations"
    if ai_auto.exists():
        for f in ai_auto.glob("*.json"):
            cat = guess_category_from_name(f.stem)
            if safe_copy(f, TARGET / cat, set()):
                stats["copied"] += 1
            else:
                stats["skipped"] += 1
        print(f"  n8n-ai-automations → keyword-categorized")

    # ── 6. n8n_ai_agents (numbered subdirs with JSON files) ───────────────
    agents = ROOT / "n8n_ai_agents"
    if agents.exists():
        for f in agents.rglob("*.json"):
            cat = guess_category_from_name(f.stem)
            if safe_copy(f, TARGET / cat, set()):
                stats["copied"] += 1
            else:
                stats["skipped"] += 1
        print(f"  n8n_ai_agents → keyword-categorized")

    # ── 7. n8n-ai-agents-masterclass-2025 (flat) ──────────────────────────
    masterclass = ROOT / "n8n-ai-agents-masterclass-2025"
    if masterclass.exists():
        for f in masterclass.glob("*.json"):
            if safe_copy(f, TARGET / "ai-agents", set()):
                stats["copied"] += 1
            else:
                stats["skipped"] += 1
        print(f"  masterclass → ai-agents")

    # ── 8. n8n-automation-templates-5000 ──────────────────────────────────
    t5000 = ROOT / "n8n-automation-templates-5000"
    if t5000.exists():
        # n8n advance (flat JSON, keyword-based)
        advance = t5000 / "n8n advance"
        if advance.exists():
            for f in advance.glob("*.json"):
                cat = guess_category_from_name(f.stem)
                if safe_copy(f, TARGET / cat, set()):
                    stats["copied"] += 1
                else:
                    stats["skipped"] += 1
            print(f"  5000/n8n advance → keyword-categorized")

        # n8n_2000_workflows (flat JSON, keyword-based)
        w2000 = t5000 / "n8n_2000_workflows"
        if w2000.exists():
            for f in w2000.glob("*.json"):
                cat = guess_category_from_name(f.stem)
                if safe_copy(f, TARGET / cat, set()):
                    stats["copied"] += 1
                else:
                    stats["skipped"] += 1
            print(f"  5000/n8n_2000_workflows → keyword-categorized")

        # Templates based on platforms (categorized by platform)
        platforms = t5000 / "Templates based on paltforms"
        if platforms.exists():
            for folder in platforms.iterdir():
                if not folder.is_dir():
                    continue
                cat = FOLDER_CATEGORY_MAP.get(folder.name, "integrations")
                process_directory(folder, cat, stats)
            print(f"  5000/Templates based on platforms → mapped categories")

        # workflows by Zie619 (numbered, keyword-based)
        zie = t5000 / "workflows by Zie619"
        if zie.exists():
            for f in zie.glob("*.json"):
                cat = guess_category_from_name(f.stem)
                if safe_copy(f, TARGET / cat, set()):
                    stats["copied"] += 1
                else:
                    stats["skipped"] += 1
            print(f"  5000/workflows by Zie619 → keyword-categorized")

    # ── 9. workflows/hub (numbered files, keyword-based) ──────────────────
    hub = ROOT / "workflows" / "hub"
    if hub.exists():
        for f in hub.glob("*.json"):
            cat = guess_category_from_name(f.stem)
            if safe_copy(f, TARGET / cat, set()):
                stats["copied"] += 1
            else:
                stats["skipped"] += 1
        print(f"  workflows/hub → keyword-categorized")

    # ── 10. n8n-workflow-all-templates (deep nested) ──────────────────────
    all_templates = ROOT / "n8n-workflow-all-templates"
    if all_templates.exists():
        for f in all_templates.rglob("*.json"):
            cat = guess_category_from_name(f.stem)
            if safe_copy(f, TARGET / cat, set()):
                stats["copied"] += 1
            else:
                stats["skipped"] += 1
        print(f"  n8n-workflow-all-templates → keyword-categorized")

    # Print final stats per category
    print("\n=== RESULTS ===")
    print(f"Total copied: {stats['copied']}")
    print(f"Total skipped (duplicates): {stats['skipped']}")
    print("\nFiles per category:")
    for cat in CATEGORIES:
        cat_dir = TARGET / cat
        if cat_dir.exists():
            count = len(list(cat_dir.glob("*.json")))
            print(f"  {cat:30s} {count:5d}")


if __name__ == "__main__":
    main()
