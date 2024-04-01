import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Post } from './Post'
import { v4 as uuidv4 } from 'uuid'

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column({ unique: true })
    email: string

  @Column({ unique: true })
    username: string

  @Column()
    password: string

  @OneToMany(() => Post, (post) => post.user)
    posts: Post[]

  @BeforeInsert()
  setId (): void {
    this.id = uuidv4()
  }

  constructor (username: string, email: string, password: string) {
    this.username = username
    this.email = email
    this.password = password
  }
}
