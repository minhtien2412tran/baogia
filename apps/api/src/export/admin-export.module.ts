import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { AdminExportController } from './admin-export.controller';
import { AdminExportService } from './admin-export.service';

@Module({
  imports: [PrismaModule, PermissionsModule],
  controllers: [AdminExportController],
  providers: [AdminExportService],
  exports: [AdminExportService],
})
export class AdminExportModule {}
