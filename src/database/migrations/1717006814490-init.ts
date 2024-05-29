import { MigrationInterface, QueryRunner } from 'typeorm';

export class init1717006814490 implements MigrationInterface {
  name = 'init1717006814490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_auth" ("password" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "REL_52403f2133a7b1851d8ab4dc9d" UNIQUE ("userId"), CONSTRAINT "PK_52403f2133a7b1851d8ab4dc9db" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "firstName" character varying(255) NOT NULL, "lastName" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("role" "public"."user_role_role_enum" NOT NULL DEFAULT 'regular_user', "userId" uuid NOT NULL, CONSTRAINT "UQ_26736dfb41d6a47ce5d8365aad7" UNIQUE ("userId", "role"), CONSTRAINT "PK_26736dfb41d6a47ce5d8365aad7" PRIMARY KEY ("role", "userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "movie" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying(255) NOT NULL, "episodeId" integer NOT NULL, "openingCrawl" text NOT NULL, "director" character varying NOT NULL, "producer" character varying NOT NULL, "releaseDate" date NOT NULL, "url" character varying NOT NULL, CONSTRAINT "UQ_a81090ad0ceb645f30f9399c347" UNIQUE ("title"), CONSTRAINT "PK_cb3bb4d61cf764dc035cbedd422" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth" ADD CONSTRAINT "FK_52403f2133a7b1851d8ab4dc9db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth" DROP CONSTRAINT "FK_52403f2133a7b1851d8ab4dc9db"`,
    );
    await queryRunner.query(`DROP TABLE "movie"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "user_auth"`);
  }
}
