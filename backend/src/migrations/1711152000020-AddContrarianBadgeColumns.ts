import { MigrationInterface, QueryRunner } from "typeorm";

export class AddContrarianBadgeColumns1711152000020 implements MigrationInterface {
  name = "AddContrarianBadgeColumns1711152000020";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // How many times the user bet against Expert consensus and won
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "contrarianWins" INT NOT NULL DEFAULT 0`,
    );
    // How many times the user bet against Expert consensus (win or lose)
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "contrarianAttempts" INT NOT NULL DEFAULT 0`,
    );
    // Badge tier: null | 'bronze' | 'silver' | 'gold'
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "contrarianBadge" VARCHAR NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "contrarianBadge"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "contrarianAttempts"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "contrarianWins"`,
    );
  }
}
