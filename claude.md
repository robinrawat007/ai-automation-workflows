# Task: Generate Workflow Meta Files

## Your Job
Read every workflow.json in this repo and generate a 
workflow.meta.json next to it.

## Rules
- Skip files that already have a .meta.json
- Process all subdirectories recursively  
- Output only valid JSON
- Be specific — no generic descriptions
- Run through ALL files, don't stop

## Output Structure
{
  "workflow_name": "short-kebab-case-name",
  "title": "Human readable title",
  "problem_solved": "One sentence — real-world pain eliminated",
  "use_case": "Who uses this and when",
  "trigger": {
    "type": "webhook|schedule|manual|email|form|database|other",
    "description": "What kicks this off"
  },
  "steps": ["Step 1", "Step 2", "Step 3"],
  "output": "Final result",
  "integrations": ["tool1", "tool2"],
  "input_expects": "What data/trigger needed",
  "output_produces": "What this produces",
  "keywords": ["15-20 search terms"],
  "category": "lead-gen|content|support|ops|finance|onboarding|data-sync|notification|ai-agent|voice|rag|other",
  "complexity": "starter|multi-step|advanced|agent",
  "can_combine_with": ["workflow types that pair well"],
  "tags": ["5-8 tags"],
  "ai_involved": true,
  "estimated_setup_time": "5 mins|15 mins|30 mins|1 hour+"
}