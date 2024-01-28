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
}
