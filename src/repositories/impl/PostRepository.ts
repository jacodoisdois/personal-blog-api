import { Post } from '../../entities/Post'
import { type IPostRepository } from '../IPostRepository'
import { inject, injectable } from 'inversify'
import { type IDataSourceService } from '../../services/IDataSourceService'
import { DATASOURCE_SERVICE } from '../../services/impl/DataSourceService'
import { TAG_SERVICE, type ITagService } from '../../services/ITagService'

@injectable()
export class PostRepository implements IPostRepository {
  private readonly dataSource: IDataSourceService
  private readonly tagService: ITagService

  constructor (@inject(DATASOURCE_SERVICE) dataSource: IDataSourceService,
    @inject(TAG_SERVICE) tagService: ITagService) {
    this.dataSource = dataSource
    this.tagService = tagService
  }

  async savePost (post: Post): Promise<void> {
    try {
      const postRepository = await this.dataSource.getRepository(Post)
      await postRepository.save(post)
    } catch (e) {
      throw new Error(`EntityCreationError: ${e}`)
    }
  }
}
