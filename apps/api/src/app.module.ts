import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth.controller';
import { QuoteController } from './controllers/quote.controller';
import { FixedPriceController } from './controllers/fixed-price.controller';
import { EmptyLegController } from './controllers/empty-leg.controller';
import { JetCardController } from './controllers/jet-card.controller';
import { PartnerController } from './controllers/partner.controller';
import { ContentController } from './controllers/content.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    QuoteController,
    FixedPriceController,
    EmptyLegController,
    JetCardController,
    PartnerController,
    ContentController,
  ],
  providers: [AppService],
})
export class AppModule {}
