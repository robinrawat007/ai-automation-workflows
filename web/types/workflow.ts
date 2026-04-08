export interface WorkflowMeta {
  id: string
  filename: string
  name: string
  trigger: string
  services: string[]
  collection: string
  category: string
  /**
   * Repo-relative path to the workflow JSON file (used for fetching raw JSON).
   * Example: "workflows/hub/0001_...json"
   */
  repoPath: string
}

export interface WorkflowDetail {
  meta: WorkflowMeta
  rawJson: unknown
  nodeCount: number
}

export interface SearchResult {
  workflows: WorkflowMeta[]
  total: number
  page: number
  pages: number
  perPage: number
}

export interface Stats {
  total: number
  hub: number
  community: number
  collections: Record<string, number>
  triggers: Record<string, number>
  categories: string[]
}
