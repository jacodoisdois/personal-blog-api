import { type Tag } from '../entities/Tag'
export const TAG_REPOSITORY = Symbol.for('TagRepository')

export interface ITagRepository {
  saveTags: (tags: Tag[]) => Promise<Tag[]>
  searchTagsByName: (tags: Tag[]) => Promise<Tag[]>
}
