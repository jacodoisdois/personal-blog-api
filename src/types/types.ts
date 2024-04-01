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

export interface findUserInput {
  emailOrUsername?: string
  email?: string
  username?: string
}

export interface authTokenResponse {
  token: string
  expired_at: string
}

export interface loginInput {
  emailOrUsername?: string
  password: string
}

export interface registerUserInput {
  username: string
  email: string
  password: string
}
