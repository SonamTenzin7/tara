import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { NOTIFICATION_QUEUE } from "./notification.queue";
import { NotificationProcessor } from "./notification.processor";

@Module({
  imports: [
    BullModule.registerQueue({ name: NOTIFICATION_QUEUE }),
  ],
  providers: [NotificationProcessor],
  exports: [BullModule],
})
export class JobsModule {}
