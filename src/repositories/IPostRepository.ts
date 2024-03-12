import { type Post } from '../entities/Post'
export const POST_REPOSITORY = Symbol.for('PostRepository')

export interface IPostRepository {
  savePost: (post: Post) => Promise<void>
}
