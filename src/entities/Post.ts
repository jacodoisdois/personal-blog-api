import { Entity, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, BeforeInsert, ManyToOne, JoinColumn } from 'typeorm'
import { Tag } from './Tag'
import { v4 as uuidv4 } from 'uuid'
import { User } from './User'

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

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'userId' })
    user: User

  @BeforeInsert()
  setId (): void {
    this.id = uuidv4()
  }

  constructor (title: string, content: string, visible: boolean) {
    this.title = title
    this.content = content
    this.visible = visible
  }
}
