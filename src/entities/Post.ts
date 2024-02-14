import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { Tag } from './Tag'

@Entity()
export class Post {
  @PrimaryColumn()
    id: string

  @Column()
    title: string

  @Column('text')
    content: string

  @ManyToMany(() => Tag, (tag) => tag.posts)
  @JoinTable()
    tags: Tag[]

  @Column()
    visible: boolean

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date

  constructor (title: string, content: string, tags: string[], visible: boolean) {
    this.title = title
    this.content = content
    this.tags = tags.map(tagName => new Tag(tagName))
    this.visible = visible
  }
}
