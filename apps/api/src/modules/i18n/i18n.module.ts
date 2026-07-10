import { Global, Module } from '@nestjs/common';
import { LocaleService } from './locale.service';
import { I18nController } from './i18n.controller';

@Global()
@Module({
  controllers: [I18nController],
  providers: [LocaleService],
  exports: [LocaleService],
})
export class I18nModule {}
