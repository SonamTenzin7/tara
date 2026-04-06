import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResolutionCriteriaToMarkets1711152000018
  implements MigrationInterface
{
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      ALTER TABLE "markets"
      ADD COLUMN IF NOT EXISTS "resolutionCriteria" text NULL
    `);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`
      ALTER TABLE "markets" DROP COLUMN IF EXISTS "resolutionCriteria"
    `);
  }
}
