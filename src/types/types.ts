export interface createPostBody {
  title: string
  content: string
  tags: string[]
  visible: boolean
}

export interface paginatedBody {
  page: number
  pageSize: number
}

export interface paginatedResponse<T> {
  data: T[]
  pageInfo: {
    totalPages: number
    pageSize: number
  }
}

export interface updatePostInput {
  title?: string
  content?: string
  visible?: boolean
}
