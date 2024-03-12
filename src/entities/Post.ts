import { Entity, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'
import { Tag } from './Tag'
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column()
    title: string

  @Column('text')
    content: string

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true
  })
  @JoinTable()
    tags: Tag[] | null

  @Column()
    visible: boolean

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date

  constructor (title: string, content: string, visible: boolean) {
    this.title = title
    this.content = content
    this.visible = visible
  }

  @BeforeInsert()
  setId (): void {
    this.id = uuidv4()
  }
}
