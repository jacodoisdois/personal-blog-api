import { Tag } from '../../entities/Tag'
import { type ITagRepository } from '../ITagRepository'
import { inject, injectable } from 'inversify'
import { type IDataSourceService } from '../../services/IDataSourceService'
import { DATASOURCE_SERVICE } from '../../services/impl/DataSourceService'

@injectable()
export class TagRepository implements ITagRepository {
  private readonly dataSource: IDataSourceService

  constructor (@inject(DATASOURCE_SERVICE) dataSource: IDataSourceService) {
    this.dataSource = dataSource
  }

  async saveTags (tags: Tag[]): Promise<Tag[]> {
    try {
      const tagRepository = await this.dataSource.getRepository(Tag)
      return await tagRepository.save(tags)
    } catch (e) {
      throw new Error(`EntityCreationError: ${e}`)
    }
  }

  async searchTagsByName (tags: Tag[]): Promise<Tag[]> {
    try {
      const tagRepository = await this.dataSource.getRepository(Tag)
      const tagNames = tags.map(tag => tag.name)
      const tagsFound = await tagRepository.createQueryBuilder('Tag')
        .where('Tag.name IN (:...tagNames)', { tagNames })
        .getMany()

      return tagsFound
    } catch (error) {
      throw new Error(error as string)
    }
  }
}
