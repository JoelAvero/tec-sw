import { MigrationInterface, QueryRunner } from 'typeorm';

export class addCascadeOnDelete1717007405725 implements MigrationInterface {
  name = 'addCascadeOnDelete1717007405725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth" DROP CONSTRAINT "FK_52403f2133a7b1851d8ab4dc9db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth" ADD CONSTRAINT "UQ_52403f2133a7b1851d8ab4dc9db" UNIQUE ("userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth" ADD CONSTRAINT "FK_52403f2133a7b1851d8ab4dc9db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_auth" DROP CONSTRAINT "FK_52403f2133a7b1851d8ab4dc9db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" DROP CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth" DROP CONSTRAINT "UQ_52403f2133a7b1851d8ab4dc9db"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_auth" ADD CONSTRAINT "FK_52403f2133a7b1851d8ab4dc9db" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_role" ADD CONSTRAINT "FK_ab40a6f0cd7d3ebfcce082131fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
