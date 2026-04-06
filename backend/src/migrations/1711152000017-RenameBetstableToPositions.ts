import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameBetstableToPositions1711152000017
  implements MigrationInterface
{
  name = "RenameBetstableToPositions1711152000017";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Drop the FK from transactions that references bets
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "FK_transactions_betId"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_transactions_betId"`
    );

    // 2. Rename the bets table to positions
    await queryRunner.query(`ALTER TABLE "bets" RENAME TO "positions"`);

    // 3. Rename betId column in transactions to positionId
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "betId" TO "positionId"`
    );

    // 4. Cast column to uuid (it was stored as varchar)
    await queryRunner.query(
      `ALTER TABLE "transactions"
       ALTER COLUMN "positionId" TYPE uuid USING "positionId"::uuid`
    );

    // 5. Recreate index and FK with new names
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_transactions_positionId" ON "transactions" ("positionId")`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions"
       ADD CONSTRAINT "FK_transactions_positionId"
       FOREIGN KEY ("positionId") REFERENCES "positions" ("id")`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transactions" DROP CONSTRAINT IF EXISTS "FK_transactions_positionId"`
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_transactions_positionId"`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions" RENAME COLUMN "positionId" TO "betId"`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions"
       ALTER COLUMN "betId" TYPE varchar USING "betId"::varchar`
    );
    await queryRunner.query(`ALTER TABLE "positions" RENAME TO "bets"`);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_transactions_betId" ON "transactions" ("betId")`
    );
    await queryRunner.query(
      `ALTER TABLE "transactions"
       ADD CONSTRAINT "FK_transactions_betId"
       FOREIGN KEY ("betId") REFERENCES "bets" ("id")`
    );
  }
}
