import { Test, TestingModule } from '@nestjs/testing';
import { StoreSetupService } from '../store-setup.service';

describe('StoreSetupService', () => {
  let service: StoreSetupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreSetupService],
    }).compile();

    service = module.get<StoreSetupService>(StoreSetupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
