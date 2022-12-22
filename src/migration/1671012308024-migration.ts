import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1671012308024 implements MigrationInterface {
  name = 'migration1671012308024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "profilePhoto" character varying NOT NULL DEFAULT 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg', "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" uuid, "chatId" uuid, CONSTRAINT "REL_bc096b4e18b1f9508197cd9806" UNIQUE ("senderId"), CONSTRAINT "REL_619bc7b78eba833d2044153bac" UNIQUE ("chatId"), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "chat" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "chatName" character varying NOT NULL, "isGroupChat" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "latestMessageId" uuid, "groupAdminId" uuid, CONSTRAINT "REL_ec25e28382614af2d460605d3f" UNIQUE ("latestMessageId"), CONSTRAINT "REL_49a3b143f34baee097ffde658a" UNIQUE ("groupAdminId"), CONSTRAINT "PK_9d0b2ba74336710fd31154738a5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "chat_users_users" ("chatId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_713b86e11c5953a582db371fa26" PRIMARY KEY ("chatId", "usersId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_cba23e8b1a61ac2f4b84060c57" ON "chat_users_users" ("chatId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dbcc3f102974a9e7213c35edac" ON "chat_users_users" ("usersId") `
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_bc096b4e18b1f9508197cd98066" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ADD CONSTRAINT "FK_619bc7b78eba833d2044153bacc" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "chat" ADD CONSTRAINT "FK_ec25e28382614af2d460605d3f3" FOREIGN KEY ("latestMessageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "chat" ADD CONSTRAINT "FK_49a3b143f34baee097ffde658a7" FOREIGN KEY ("groupAdminId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "chat_users_users" ADD CONSTRAINT "FK_cba23e8b1a61ac2f4b84060c573" FOREIGN KEY ("chatId") REFERENCES "chat"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "chat_users_users" ADD CONSTRAINT "FK_dbcc3f102974a9e7213c35edacc" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_users_users" DROP CONSTRAINT "FK_dbcc3f102974a9e7213c35edacc"`
    );
    await queryRunner.query(
      `ALTER TABLE "chat_users_users" DROP CONSTRAINT "FK_cba23e8b1a61ac2f4b84060c573"`
    );
    await queryRunner.query(
      `ALTER TABLE "chat" DROP CONSTRAINT "FK_49a3b143f34baee097ffde658a7"`
    );
    await queryRunner.query(
      `ALTER TABLE "chat" DROP CONSTRAINT "FK_ec25e28382614af2d460605d3f3"`
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_619bc7b78eba833d2044153bacc"`
    );
    await queryRunner.query(
      `ALTER TABLE "message" DROP CONSTRAINT "FK_bc096b4e18b1f9508197cd98066"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_dbcc3f102974a9e7213c35edac"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_cba23e8b1a61ac2f4b84060c57"`
    );
    await queryRunner.query(`DROP TABLE "chat_users_users"`);
    await queryRunner.query(`DROP TABLE "chat"`);
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
