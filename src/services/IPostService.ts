export const POST_SERVICE = Symbol.for('PostService')

export interface IPostService {
  createPost: (title: string, content: string, tags: string[], visible: boolean) => Promise<void>
}
