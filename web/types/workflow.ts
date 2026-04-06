export interface WorkflowMeta {
  id: string
  filename: string
  name: string
  trigger: string
  services: string[]
  collection: string
  category: string
  filePath: string
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
