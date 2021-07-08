import { Test, TestingModule } from '@nestjs/testing';
import { CataloguesService } from './catalogues.service';

describe('CataloguesService', () => {
  let service: CataloguesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CataloguesService],
    }).compile();

    service = module.get<CataloguesService>(CataloguesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
