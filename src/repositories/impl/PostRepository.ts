import { Post } from '../../entities/Post'
import { type IPostRepository } from '../IPostRepository'
import { inject, injectable } from 'inversify'
import { type IDataSourceService } from '../../services/IDataSourceService'
import { DATASOURCE_SERVICE } from '../../services/impl/DataSourceService'
import { TAG_SERVICE, type ITagService } from '../../services/ITagService'
import { type updatePostInput, type paginatedResponse } from '../../types/types'
import { EntityNotFoundError } from 'typeorm'

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

  async getPaginatedPosts (page: number = 1, pageSize: number = 10): Promise<paginatedResponse<Post>> {
    const postRepository = await this.dataSource.getRepository(Post)

    const [data, total] = await postRepository.findAndCount({
      relations: ['tags'],
      skip: (page - 1) * pageSize,
      take: pageSize
    })

    return {
      data,
      pageInfo: {
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    }
  }

  async getPost (id: string): Promise<Post> {
    const postRepository = await this.dataSource.getRepository(Post)

    const data = await postRepository.find({
      where: {
        id
      },
      relations: ['tags']
    }) as unknown as Post[]

    if (data.length === 0) throw new EntityNotFoundError(Post, 'id')

    return data[0]
  }

  async deletePost (id: string): Promise<void> {
    const postRepository = await this.dataSource.getRepository(Post)

    const deleteResult = await postRepository.delete(id)

    if (deleteResult.affected === 0) {
      throw new EntityNotFoundError(Post, 'id')
    }
  }

  async updatePost (id: string, updateData: updatePostInput): Promise<Post> {
    const postRepository = await this.dataSource.getRepository(Post)

    await postRepository.update(id, updateData)

    const updatedPost = await postRepository.findOne({
      where: { id },
      relations: ['tags']
    }) as Post | undefined

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!updatedPost) {
      throw new EntityNotFoundError(Post, 'id')
    }
    return updatedPost
  }
}
