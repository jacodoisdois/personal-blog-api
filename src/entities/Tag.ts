import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm'
import { Post } from './Post'

@Entity()
export class Tag {
  @PrimaryColumn()
    id: string

  @Column()
    name: string

  @ManyToMany(() => Post, (post) => post.tags)
    posts: Post[]

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date
}
