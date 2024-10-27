import { Test, TestingModule } from '@nestjs/testing';
import { StoreSetupController } from '../store-setup.controller';
import { StoreSetupService } from '../store-setup.service';

describe('StoreSetupController', () => {
  let controller: StoreSetupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreSetupController],
      providers: [StoreSetupService],
    }).compile();

    controller = module.get<StoreSetupController>(StoreSetupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
