import { Post } from '../../entities/Post'
import { type IPostRepository } from '../IPostRepository'
import { inject, injectable } from 'inversify'
import { IDataSourceService } from '../../services/IDataSourceService'
import { DATASOURCE_SERVICE } from '../../services/impl/DataSourceService'
import { type updatePostInput, type paginatedResponse } from '../../types/types'
import { EntityNotFoundError } from 'typeorm'

@injectable()
export class PostRepository implements IPostRepository {
  private readonly dataSource: IDataSourceService

  constructor (
  @inject(DATASOURCE_SERVICE) dataSource: IDataSourceService
  ) {
    this.dataSource = dataSource
  }

  async savePost (post: Post): Promise<Post> {
    try {
      const postRepository = await this.dataSource.getRepository(Post)
      return await postRepository.save(post)
    } catch (error) {
      throw new Error(`Failed to save post: ${error.message}`)
    }
  }

  async getPaginatedPosts (page: number = 1, pageSize: number = 10): Promise<paginatedResponse<Post>> {
    try {
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
    } catch (error) {
      throw new Error(`Failed to get paginated posts: ${error.message}`)
    }
  }

  async getPost (id: string): Promise<Post> {
    try {
      const postRepository = await this.dataSource.getRepository(Post)
      const data = await postRepository.findOneOrFail({ where: { id }, relations: ['tags'] })

      return data
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(`Post not found with ID ${id}`)
      } else {
        throw new Error(`Failed to get post: ${error.message}`)
      }
    }
  }

  async deletePost (id: string): Promise<void> {
    try {
      const postRepository = await this.dataSource.getRepository(Post)
      const deleteResult = await postRepository.delete(id)

      if (deleteResult.affected === 0) {
        throw new EntityNotFoundError(Post, id)
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(`Post not found with ID ${id}`)
      }

      throw new Error(`Failed to delete post: ${error.message}`)
    }
  }

  async updatePost (id: string, updateData: updatePostInput): Promise<Post> {
    try {
      const postRepository = await this.dataSource.getRepository(Post)
      await postRepository.update(id, updateData)
      const updatedPost = await postRepository.findOneOrFail({
        where: {
          id
        },
        relations: ['tags']
      })

      return updatedPost
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new Error(`Post not found with ID ${id}`)
      }

      throw new Error(`Failed to update post: ${error.message}`)
    }
  }
}
