import { Container } from 'inversify'
import { PostRepository } from '../repositories/PostRepository'
import { type IPostRepository, POST_REPOSITORY } from '../repositories/impl/IPostRepository'
import { PostService } from '../services/impl/PostService'
import { type IPostService, POST_SERVICE } from '../services/IPostService'
import createDataSource, { DATASOURCE } from '../config/typeorm/dataSource'
import { type DataSource } from 'typeorm'
import { POST_CONTROLLER, PostController } from '../controllers/PostController'

const dataSourceInstance = createDataSource()

export const PostContainer = (): Container => {
  const container = new Container()

  container.bind<DataSource>(DATASOURCE).toConstantValue(dataSourceInstance)
  container.bind<IPostRepository>(POST_REPOSITORY).to(PostRepository)

  container.bind<IPostService>(POST_SERVICE).to(PostService)

  container.bind<PostController>(POST_CONTROLLER).to(PostController)

  return container
}
