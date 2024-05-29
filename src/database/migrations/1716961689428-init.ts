import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1716961689428 implements MigrationInterface {
  name = 'init1716961689428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "password" character varying NOT NULL, "userDetailsId" uuid, CONSTRAINT "REL_51dabb934475afa077f62c116c" UNIQUE ("userDetailsId"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "UQ_34071c8003531ced970246523e4" UNIQUE ("email"), CONSTRAINT "PK_fb08394d3f499b9e441cab9ca51" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_role_role_enum" AS ENUM('admin', 'regular_user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("role" "public"."user_role_role_enum" NOT NULL DEFAULT 'regular_user', "userDetailsId" uuid NOT NULL, CONSTRAINT "UQ_2d4d5c75a3af0ace1ba020c8cca" UNIQUE ("userDetailsId", "role"), CONSTRAINT "PK_2d4d5c75a3af0ace1ba020c8cca" PRIMARY KEY ("role", "userDetailsId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "episodeId" integer NOT NULL, "openingCrawl" text NOT NULL, "director" character varying NOT NULL, "producer" character varying NOT NULL, "releaseDate" date NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_51dabb934475afa077f62c116c0" FOREIGN KEY ("userDetailsId") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_4c2a6a3b45879acf3e86637a913" FOREIGN KEY ("userDetailsId") REFERENCES "user_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_4c2a6a3b45879acf3e86637a913"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_51dabb934475afa077f62c116c0"`,
    );
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TYPE "public"."user_role_role_enum"`);
    await queryRunner.query(`DROP TABLE "user_details"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
