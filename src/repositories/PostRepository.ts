import { type DataSource } from 'typeorm'
import { type Post } from '../entities/Post'
import { type IPostRepository } from './impl/IPostRepository'
import { inject, injectable } from 'inversify'
import { DATASOURCE } from '../config/typeorm/dataSource'

@injectable()
export class PostRepository implements IPostRepository {
  private readonly dataSource: DataSource

  constructor (@inject(DATASOURCE) dataSource: DataSource) {
    this.dataSource = dataSource
  }

  async savePost (post: Post): Promise<void> {
    try {
      const postRepository = this.dataSource.getRepository('Post')
      console.log(await this.dataSource.query('select * from post'))
      console.log(postRepository.create(post))
      await postRepository.save(post)
      console.log('Saved post successfully')
    } catch (e) {
      console.log(e)
    }
  }
}
