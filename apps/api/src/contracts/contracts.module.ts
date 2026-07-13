import { Module } from '@nestjs/common';
import { ContractController } from './contract.controller';
import { ContractService } from './contract.service';
import { MockDocuSignProvider, SIGNATURE_PROVIDER } from './signature.provider';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PermissionsModule],
  controllers: [ContractController],
  providers: [
    ContractService,
    MockDocuSignProvider,
    { provide: SIGNATURE_PROVIDER, useExisting: MockDocuSignProvider },
  ],
  exports: [ContractService],
})
export class ContractsModule {}
