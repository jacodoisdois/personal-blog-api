export const POST_SERVICE = Symbol.for('PostService')

export interface IPostService {
  createPostAndTags: (title: string, content: string, tags: string[], visible: boolean) => Promise<void>
}
