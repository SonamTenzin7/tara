import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogs1711152000015 implements MigrationInterface {
  async up(runner: QueryRunner): Promise<void> {
    await runner.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id"            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "adminId"       UUID NOT NULL,
        "adminUsername" VARCHAR,
        "action"        VARCHAR NOT NULL,
        "entityType"    VARCHAR,
        "entityId"      VARCHAR,
        "payload"       JSONB,
        "ipAddress"     VARCHAR,
        "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX "IDX_audit_logs_adminId"   ON "audit_logs" ("adminId");
      CREATE INDEX "IDX_audit_logs_action"    ON "audit_logs" ("action");
      CREATE INDEX "IDX_audit_logs_entityId"  ON "audit_logs" ("entityId");
      CREATE INDEX "IDX_audit_logs_createdAt" ON "audit_logs" ("createdAt" DESC);
    `);
  }

  async down(runner: QueryRunner): Promise<void> {
    await runner.query(`DROP TABLE IF EXISTS "audit_logs";`);
  }
}
