import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuditLog, AuditAction } from "../entities/audit-log.entity";

interface AuditParams {
  adminId: string;
  adminUsername?: string;
  action: AuditAction | string;
  entityType?: string;
  entityId?: string;
  before?: Record<string, any>;
  after?: Record<string, any>;
  meta?: Record<string, any>;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async log(params: AuditParams): Promise<void> {
    const entry = this.repo.create({
      adminId: params.adminId,
      adminUsername: params.adminUsername,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      payload: {
        before: params.before,
        after: params.after,
        meta: params.meta,
      },
      ipAddress: params.ipAddress,
    });
    // Fire-and-forget — never block the main request
    await this.repo
      .save(entry)
      .catch((err) =>
        console.error(
          "[AuditService] Failed to write audit log:",
          err?.message,
        ),
      );
  }

  findAll(limit = 200) {
    return this.repo.find({
      order: { createdAt: "DESC" },
      take: Math.min(limit, 500),
    });
  }

  findByAdmin(adminId: string, limit = 100) {
    return this.repo.find({
      where: { adminId },
      order: { createdAt: "DESC" },
      take: Math.min(limit, 200),
    });
  }

  findByEntity(entityId: string) {
    return this.repo.find({
      where: { entityId },
      order: { createdAt: "DESC" },
    });
  }
}
