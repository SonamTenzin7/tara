import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIntelligenceLayerColumns1711152000019 implements MigrationInterface {
  name = "AddIntelligenceLayerColumns1711152000019";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // User: Brier score calibration tracking
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "brierScore" DECIMAL(5,4) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "brierCount" INT NOT NULL DEFAULT 0`,
    );
    // User: last activity timestamp for decay
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "lastActiveAt" TIMESTAMPTZ NULL`,
    );
    // Position: LMSR probability at placement for Brier scoring
    await queryRunner.query(
      `ALTER TABLE "positions" ADD COLUMN IF NOT EXISTS "predictedProbability" DECIMAL(10,6) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "positions" DROP COLUMN IF EXISTS "predictedProbability"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "lastActiveAt"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "brierCount"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "brierScore"`);
  }
}
