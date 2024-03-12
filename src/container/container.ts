import { Container } from 'inversify'
import { PostRepository } from '../repositories/impl/PostRepository'
import { type IPostRepository, POST_REPOSITORY } from '../repositories/IPostRepository'
import { PostService } from '../services/impl/PostService'
import { type IPostService, POST_SERVICE } from '../services/IPostService'
import { POST_CONTROLLER, PostController } from '../controllers/PostController'
import { DATASOURCE_SERVICE, DataSourceService } from '../services/impl/DataSourceService'
import { type IDataSourceService } from '../services/IDataSourceService'
import { type ITagRepository, TAG_REPOSITORY } from '../repositories/ITagRepository'
import { TagRepository } from '../repositories/impl/TagRepository'
import { type ITagService, TAG_SERVICE } from '../services/ITagService'
import { TagService } from '../services/impl/TagService'

export const PostContainer = (): Container => {
  const container = new Container()

  container.bind<IDataSourceService>(DATASOURCE_SERVICE).to(DataSourceService)
  container.bind<IPostRepository>(POST_REPOSITORY).to(PostRepository)
  container.bind<ITagRepository>(TAG_REPOSITORY).to(TagRepository)

  container.bind<IPostService>(POST_SERVICE).to(PostService)
  container.bind<ITagService>(TAG_SERVICE).to(TagService)

  container.bind<PostController>(POST_CONTROLLER).to(PostController)

  return container
}
