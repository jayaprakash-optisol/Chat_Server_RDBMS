import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Chat } from './Chat';
import { Message } from './Message';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({
    default:
      'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg',
  })
  profilePhoto: string;

  @ManyToMany(() => Chat, (chat: Chat) => chat.users)
  chats: Chat[];

  @OneToMany(() => Message, (message: Message) => message.sender)
  messages: Message[];

  @OneToMany(() => Chat, (chat: Chat) => chat.groupAdmin)
  admin: Chat[];

  @Column('boolean', { default: false, nullable: false })
  isAdmin: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
