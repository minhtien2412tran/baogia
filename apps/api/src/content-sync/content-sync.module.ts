import { Module } from '@nestjs/common';
import { PermissionsModule } from '../permissions/permissions.module';
import { ContentSyncService } from './content-sync.service';
import { ContentSyncController } from './content-sync.controller';

@Module({
  imports: [PermissionsModule],
  controllers: [ContentSyncController],
  providers: [ContentSyncService],
  exports: [ContentSyncService],
})
export class ContentSyncModule {}
