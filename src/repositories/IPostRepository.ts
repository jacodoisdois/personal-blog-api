import { type Post } from '../entities/Post'
import { type updatePostInput, type paginatedResponse } from '../types/types'
export const POST_REPOSITORY = Symbol.for('PostRepository')

export interface IPostRepository {
  savePost: (post: Post) => Promise<void>
  getPaginatedPosts: (page: number, pageSize: number) => Promise<paginatedResponse<Post>>
  getPost: (id: string) => Promise<Post>
  deletePost: (id: string) => Promise<void>
  updatePost: (id: string, updateData: updatePostInput) => Promise<Post>
}
