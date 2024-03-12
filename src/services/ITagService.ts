import { type Tag } from '../entities/Tag'

export const TAG_SERVICE = Symbol.for('TagService')

export interface ITagService {
  createTags: (tags: Tag[]) => Promise<Tag[]>
}
