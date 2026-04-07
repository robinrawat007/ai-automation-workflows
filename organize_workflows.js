#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname);
const TARGET = path.join(ROOT, "organized-workflows");

const CATEGORIES = [
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
];

const FOLDER_CATEGORY_MAP = {
  AI_Research_RAG_and_Data_Analysis: "ai-agents",
  OpenAI_and_LLMs: "ai-agents",
  AI_ML: "ai-agents",
  ArXiv: "ai-agents",
  OpenAI: "ai-agents",
  Transcription: "ai-agents",

  communication: "communication",
  notification: "communication",
  Gmail_and_Email_Automation: "communication",
  Email_Automation: "communication",
  Discord: "communication",
  Slack: "communication",
  Telegram: "communication",
  WhatsApp: "communication",
  Twilio: "communication",
  Mattermost: "communication",

  "content-management": "content-creation",
  Creative_Content: "content-creation",
  Media: "content-creation",
  WordPress: "content-creation",
  Medium: "content-creation",
  RSS: "content-creation",

  crm: "crm-sales",
  CRM: "crm-sales",
  HubSpot: "crm-sales",
  Pipedrive: "crm-sales",
  Salesforce: "crm-sales",
  "Zoho CRM": "crm-sales",
  Clearbit: "crm-sales",

  analytics: "data-analytics",
  data_processing: "data-analytics",
  Data_Analytics: "data-analytics",
  Database_and_Storage: "data-analytics",
  MySQL: "data-analytics",
  Postgres: "data-analytics",
  "Open Data": "data-analytics",

  devops: "devops",
  DevOps: "devops",
  backup: "devops",
  monitoring: "devops",
  security: "devops",
  IoT: "devops",
  GitHub: "devops",
  AWS: "devops",
  PagerDuty: "devops",
  "Home Assistant": "devops",
  "Philips Hue": "devops",

  "e-commerce": "e-commerce",
  E_Commerce_Retail: "e-commerce",
  Shopify: "e-commerce",
  WooCommerce: "e-commerce",
  Stripe: "e-commerce",
  "Booking.com": "e-commerce",
  Skyscanner: "e-commerce",
  Zillow: "e-commerce",

  finance: "finance",
  Finance_Accounting: "finance",
  QuickBooks: "finance",
  Xero: "finance",

  hr: "hr-recruitment",
  HR: "hr-recruitment",
  HR_and_Recruitment: "hr-recruitment",
  BambooHR: "hr-recruitment",
  Workday: "hr-recruitment",

  marketing: "marketing",
  Mailchimp: "marketing",
  Instagram: "marketing",
  LinkedIn: "marketing",
  Twitter: "marketing",
  Eventbrite: "marketing",

  automation: "productivity",
  productivity: "productivity",
  Forms_and_Surveys: "productivity",
  Todoist: "productivity",
  Zoom: "productivity",
  Jira: "productivity",
  Moodle: "productivity",

  "social-media": "social-media",
  Instagram_Twitter_Social_Media: "social-media",

  PDF_and_Document_Processing: "document-processing",

  integration: "integrations",
  Airtable: "integrations",
  Notion: "integrations",
  Google_Drive_and_Google_Sheets: "integrations",
  Google: "integrations",
  Other_Integrations_and_Use_Cases: "integrations",
  Freshdesk: "integrations",
  Zendesk: "integrations",
  ESPN: "integrations",
  Fitbit: "integrations",
  IFTTT: "integrations",

  other: "other",
  Other: "other",
  Misc: "other",
  misc: "other",
  Agriculture: "other",
  Automotive: "other",
  Education: "other",
  Energy: "other",
  Gaming: "other",
  Government_NGO: "other",
  Healthcare: "other",
  Legal_Tech: "other",
  Manufacturing: "other",
};

const KEYWORD_CATEGORY = {
  "ai-agents": [
    "ai", "agent", "chatbot", "llm", "gpt", "openai", "rag", "vector",
    "pinecone", "embedding", "claude", "anthropic", "gemini", "langchain",
    "knowledge", "transcri", "whisper", "ollama", "mistral", "classifier",
    "summariz", "sentiment",
  ],
  communication: [
    "email", "gmail", "slack", "telegram", "whatsapp", "discord", "sms",
    "twilio", "notification", "alert", "inbox", "mailbox", "smtp", "imap",
  ],
  "content-creation": [
    "content", "blog", "post", "article", "newsletter", "wordpress",
    "medium", "rss", "podcast", "video", "youtube", "caption", "copy",
    "generate_post", "repurpos", "script_write",
  ],
  "crm-sales": [
    "crm", "lead", "sales", "hubspot", "pipedrive", "salesforce",
    "contact", "deal", "customer", "prospect", "cold_email",
  ],
  "data-analytics": [
    "analytic", "data_", "report", "dashboard", "sheet", "csv",
    "database", "mysql", "postgres", "sql", "bigquery", "mongodb",
    "spreadsheet", "airtable_data",
  ],
  devops: [
    "devops", "github", "deploy", "monitor", "incident", "security",
    "backup", "aws", "docker", "ci_cd", "pipeline", "server", "uptime",
    "log_", "pagerduty",
  ],
  "e-commerce": [
    "shopify", "woocommerce", "stripe", "payment", "order", "ecommerce",
    "product", "inventory", "checkout", "woo",
  ],
  finance: [
    "finance", "invoice", "account", "budget", "expense", "quickbooks",
    "xero", "billing", "tax", "receipt",
  ],
  "hr-recruitment": [
    "hr_", "_hr_", "recruit", "hire", "employee", "onboard", "bamboohr",
    "payroll", "attendance", "leave_request",
  ],
  marketing: [
    "marketing", "campaign", "mailchimp", "facebook_ad", "google_ad",
    "linkedin_ad", "ad_", "_ad_", "seo", "competitor",
  ],
  productivity: [
    "task_", "todo", "todoist", "trello", "jira", "asana", "calendar",
    "meeting", "schedule", "zoom", "form_", "survey", "notion_",
  ],
  "social-media": [
    "instagram", "twitter", "linkedin", "facebook", "tiktok",
    "social_media", "tweet", "post_to",
  ],
  "document-processing": [
    "pdf", "document", "docx", "ocr", "extract_", "gdrive",
    "google_drive", "dropbox", "s3_file",
  ],
  integrations: [
    "airtable", "notion", "google_sheet", "webhook", "api_", "sync_",
    "zapier", "integration",
  ],
};

function guessCategoryFromName(filename) {
  const name = filename.toLowerCase().replace(/[-\s]/g, "_");
  for (const [cat, keywords] of Object.entries(KEYWORD_CATEGORY)) {
    for (const kw of keywords) {
      if (name.includes(kw)) return cat;
    }
  }
  return "other";
}

const stats = { copied: 0, skipped: 0 };
// Track which filenames we've seen per category to handle collisions
const seenFiles = {}; // category -> Set of names

function safeCopy(src, catName) {
  const dstDir = path.join(TARGET, catName);
  fs.mkdirSync(dstDir, { recursive: true });

  if (!seenFiles[catName]) seenFiles[catName] = new Set();

  const base = path.basename(src);
  const ext = path.extname(base);
  const stem = path.basename(base, ext);

  let dstName = base;
  let counter = 1;

  while (seenFiles[catName].has(dstName)) {
    // Check size to detect actual duplicate
    const existing = path.join(dstDir, dstName);
    try {
      const srcSize = fs.statSync(src).size;
      const dstSize = fs.statSync(existing).size;
      if (srcSize === dstSize) {
        stats.skipped++;
        return; // skip duplicate
      }
    } catch (_) {}
    dstName = `${stem}_${counter}${ext}`;
    counter++;
  }

  fs.copyFileSync(src, path.join(dstDir, dstName));
  seenFiles[catName].add(dstName);
  stats.copied++;
}

function processDir(srcDir, category) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(srcDir, e.name);
    if (e.isDirectory()) {
      processDir(full, category);
    } else if (e.name.endsWith(".json")) {
      safeCopy(full, category);
    }
  }
}

function processDirCategorized(srcDir, skipNames = []) {
  if (!fs.existsSync(srcDir)) return;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (skipNames.includes(entry.name)) continue;
    const cat = FOLDER_CATEGORY_MAP[entry.name] || "other";
    console.log(`  ${path.basename(srcDir)}/${entry.name} → ${cat}`);
    processDir(path.join(srcDir, entry.name), cat);
  }
}

function processFlatDir(srcDir, defaultCat = null) {
  if (!fs.existsSync(srcDir)) return;
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".json")) continue;
    const cat = defaultCat || guessCategoryFromName(entry.name);
    safeCopy(path.join(srcDir, entry.name), cat);
  }
}

// Create category dirs
fs.mkdirSync(TARGET, { recursive: true });
for (const cat of CATEGORIES) fs.mkdirSync(path.join(TARGET, cat), { recursive: true });

// 1. workflows/community
console.log("Processing workflows/community...");
processDirCategorized(path.join(ROOT, "workflows", "community"), ["README.md"]);

// 2. awesome-n8n-workflows
console.log("Processing awesome-n8n-workflows...");
processDirCategorized(path.join(ROOT, "awesome-n8n-workflows"), ["LICENSE"]);

// 3. n8n-free-templates
console.log("Processing n8n-free-templates...");
processDirCategorized(path.join(ROOT, "n8n-free-templates"), []);

// 4. n8n-automation-2025-AI-Agent-Suite
console.log("Processing n8n-automation-2025-AI-Agent-Suite...");
processDirCategorized(path.join(ROOT, "n8n-automation-2025-AI-Agent-Suite"), ["img"]);

// 5. n8n-ai-automations
console.log("Processing n8n-ai-automations...");
processFlatDir(path.join(ROOT, "n8n-ai-automations"));

// 6. n8n_ai_agents
console.log("Processing n8n_ai_agents...");
processDir(path.join(ROOT, "n8n_ai_agents"), "ai-agents");

// 7. n8n-ai-agents-masterclass-2025
console.log("Processing n8n-ai-agents-masterclass-2025...");
processFlatDir(path.join(ROOT, "n8n-ai-agents-masterclass-2025"), "ai-agents");

// 8. n8n-automation-templates-5000
console.log("Processing n8n-automation-templates-5000...");
const t5000 = path.join(ROOT, "n8n-automation-templates-5000");
processFlatDir(path.join(t5000, "n8n advance"));
processFlatDir(path.join(t5000, "n8n_2000_workflows"));
processDirCategorized(path.join(t5000, "Templates based on paltforms"), []);
processFlatDir(path.join(t5000, "workflows by Zie619"));

// 9. workflows/hub
console.log("Processing workflows/hub...");
processFlatDir(path.join(ROOT, "workflows", "hub"));

// 10. n8n-workflow-all-templates
console.log("Processing n8n-workflow-all-templates...");
function processAllTemplates(srcDir) {
  if (!fs.existsSync(srcDir)) return;
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(srcDir, e.name);
    if (e.isDirectory()) {
      processAllTemplates(full);
    } else if (e.name.endsWith(".json")) {
      safeCopy(full, guessCategoryFromName(e.name));
    }
  }
}
processAllTemplates(path.join(ROOT, "n8n-workflow-all-templates"));

// Print results
console.log("\n=== RESULTS ===");
console.log(`Total copied: ${stats.copied}`);
console.log(`Total skipped (duplicates): ${stats.skipped}`);
console.log("\nFiles per category:");
for (const cat of CATEGORIES) {
  const dir = path.join(TARGET, cat);
  const count = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".json")).length : 0;
  console.log(`  ${cat.padEnd(30)} ${count}`);
}
