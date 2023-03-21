import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class ChatMigration1679387067271 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isNullable: false, isUnique: true },
          { name: 'password', type: 'varchar', isNullable: false },
          {
            name: 'profilePhoto',
            type: 'varchar',
            isNullable: false,
            default:
              "'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'",
          },
          {
            name: 'isAdmin',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'message',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'content', type: 'text', isNullable: false },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          { name: 'senderId', type: 'int', isNullable: true },
          { name: 'chatId', type: 'int', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'chat',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'chatName', type: 'varchar', isNullable: false },
          { name: 'isGroupChat', type: 'boolean', isNullable: false },
          {
            name: 'createdAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            isNullable: false,
            default: 'now()',
          },
          { name: 'latestMessageId', type: 'int', isNullable: true },
          { name: 'groupAdminId', type: 'int', isNullable: true },
        ],
      }),
      true,
    );

    await queryRunner.createTable(
      new Table({
        name: 'chat_users_users',
        columns: [
          { name: 'chatId', type: 'int', isNullable: false },
          { name: 'usersId', type: 'int', isNullable: false },
        ],
        uniques: [{ columnNames: ['chatId', 'usersId'] }],
      }),
      true,
    );

    await queryRunner.createForeignKeys('message', [
      new TableForeignKey({
        name: 'fk_messages_chat',
        columnNames: ['chatId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'chat',
      }),
      new TableForeignKey({
        name: 'fk_messages_sender',
        columnNames: ['senderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    ]);

    await queryRunner.createForeignKeys('chat', [
      new TableForeignKey({
        name: 'fk_chats_latest_message',
        columnNames: ['latestMessageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'message',
      }),
      new TableForeignKey({
        name: 'fk_chats_group_admin',
        columnNames: ['groupAdminId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    ]);

    await queryRunner.createForeignKeys('chat_users_users', [
      new TableForeignKey({
        name: 'fk_chats_users_user',
        columnNames: ['usersId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
      new TableForeignKey({
        name: 'fk_chats_users_chats',
        columnNames: ['chatId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'chat',
      }),
    ]);

    await queryRunner.createIndices('users', [
      new TableIndex({
        name: 'idx_users',
        columnNames: ['name', 'email', 'isAdmin'],
      }),
    ]);

    await queryRunner.createIndices('message', [
      new TableIndex({
        name: 'idx_messages',
        columnNames: ['senderId', 'chatId'],
      }),
    ]);

    await queryRunner.createIndices('chat', [
      new TableIndex({
        name: 'idx_chats',
        columnNames: ['chatName', 'isGroupChat', 'latestMessageId'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
    await queryRunner.dropTable('message');
    await queryRunner.dropTable('chat');
    await queryRunner.dropTable('chat_users');

    await queryRunner.dropForeignKeys('chat_users_users', [
      new TableForeignKey({
        name: 'fk_chats_users_user',
        columnNames: ['usersId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
      new TableForeignKey({
        name: 'fk_chats_users_chats',
        columnNames: ['chatId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'chat',
      }),
    ]);
    await queryRunner.dropForeignKeys('chat', [
      new TableForeignKey({
        name: 'fk_chats_latest_message',
        columnNames: ['latestMessageId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'message',
      }),
      new TableForeignKey({
        name: 'fk_chats_group_admin',
        columnNames: ['groupAdminId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    ]);
    await queryRunner.dropForeignKeys('message', [
      new TableForeignKey({
        name: 'fk_messages_chat',
        columnNames: ['chatId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'chat',
      }),
      new TableForeignKey({
        name: 'fk_messages_sender',
        columnNames: ['senderId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
      }),
    ]);

    await queryRunner.dropIndices('users', [
      new TableIndex({
        name: 'idx_users',
        columnNames: ['name', 'email', 'isAdmin'],
      }),
    ]);

    await queryRunner.dropIndices('message', [
      new TableIndex({
        name: 'idx_messages',
        columnNames: ['senderId', 'chatId'],
      }),
    ]);

    await queryRunner.dropIndices('chat', [
      new TableIndex({
        name: 'idx_chats',
        columnNames: ['chatName', 'isGroupChat', 'latestMessageId'],
      }),
    ]);
  }
}
