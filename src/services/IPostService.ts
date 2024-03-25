import { type Post } from '../entities/Post'
import { type updatePostInput, type paginatedResponse } from '../types/types'

export const POST_SERVICE = Symbol.for('PostService')

export interface IPostService {
  createPostAndTags: (title: string, content: string, tags: string[], visible: boolean) => Promise<Post>
  getPosts: (page: number, pageSize: number) => Promise<paginatedResponse<Post>>
  getPost: (id: string) => Promise<Post>
  deletePost: (id: string) => Promise<void>
  updatePost: (id: string, updateData: updatePostInput) => Promise<Post>
}
