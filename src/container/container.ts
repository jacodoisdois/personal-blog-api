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
import { type IUserRepository, USER_REPOSITORY } from '../repositories/IUserRepository'
import { UserRepository } from '../repositories/impl/UserRepository'
import { AUTH_SERVICE, type IAuthService } from '../services/IAuthService'
import AuthService from '../services/impl/AuthService'
import { AUTH_CONTROLLER, AuthController } from '../controllers/AuthController'

export const PostContainer = (): Container => {
  const container = new Container()

  container.bind<IDataSourceService>(DATASOURCE_SERVICE).to(DataSourceService).inSingletonScope()
  container.bind<IPostRepository>(POST_REPOSITORY).to(PostRepository)
  container.bind<ITagRepository>(TAG_REPOSITORY).to(TagRepository)
  container.bind<IUserRepository>(USER_REPOSITORY).to(UserRepository)

  container.bind<IPostService>(POST_SERVICE).to(PostService)
  container.bind<ITagService>(TAG_SERVICE).to(TagService)
  container.bind<IAuthService>(AUTH_SERVICE).to(AuthService)

  container.bind<AuthController>(AUTH_CONTROLLER).to(AuthController)
  container.bind<PostController>(POST_CONTROLLER).to(PostController)

  return container
}
