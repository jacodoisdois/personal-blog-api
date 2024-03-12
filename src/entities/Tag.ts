import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { Post } from './Post'
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class Tag {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column({ unique: true })
    name: string

  @ManyToMany(() => Post, (post) => post.tags)
    posts: Post[]

  @CreateDateColumn()
    createdAt: Date

  @UpdateDateColumn()
    updatedAt: Date

  constructor (name: string) {
    this.name = name
  }

  @BeforeInsert()
  setId (): void {
    this.id = uuidv4()
  }
}
