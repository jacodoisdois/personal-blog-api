import { inject, injectable } from 'inversify'
import { type ITagService } from '../ITagService'
import { type Tag } from '../../entities/Tag'
import { TagRepository } from '../../repositories/impl/TagRepository'
import { TAG_REPOSITORY } from '../../repositories/ITagRepository'

@injectable()
export class TagService implements ITagService {
  private readonly tagRepository: TagRepository

  constructor (@inject(TAG_REPOSITORY) tagRepository: TagRepository) {
    this.tagRepository = tagRepository
  }

  async createTags (tags: Tag[]): Promise<Tag[]> {
    try {
      console.log('Trying to create one or more tags!')
      const foundTags = await this.tagRepository.searchTagsByName(tags)
      const notFoundTags = this.filterNotFoundTags(tags, foundTags)
      const createdTags = await this.tagRepository.saveTags(notFoundTags)
      console.log('Tags created successfully!')
      return [...createdTags, ...foundTags]
    } catch (e) {
      throw new Error('Error when tried to create a Tag' + e)
    }
  }

  filterNotFoundTags (tags: Tag[], foundTags: Tag[]): Tag[] {
    const foundTagNames = foundTags.map(tag => tag.name)
    return tags.filter(tag => !foundTagNames.includes(tag.name))
  }
}
