import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Message } from './Message';
import { User } from './User';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatName: string;

  @Column()
  isGroupChat: boolean;

  @ManyToMany(() => User, (user: User) => user.chats, { cascade: true })
  @JoinTable()
  users: User[];

  @OneToMany(() => Message, (message: Message) => message.chat)
  latestMessages: Message;

  @Column('uuid', { nullable: true })
  latestMessageId: number;

  @ManyToOne(() => User, (user: User) => user.admin)
  groupAdmin: User;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
