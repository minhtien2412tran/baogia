import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IntegrationsStatusService } from './services/integrations-status.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: IntegrationsStatusService,
          useValue: { getStatus: () => ({ ok: true }) },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return API metadata', () => {
      const result = appController.getRoot();
      expect(result).toMatchObject({ name: 'JetBay API', status: 'ok', swagger: '/swagger' });
    });
  });
});
