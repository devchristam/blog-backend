import { Test, TestingModule } from '@nestjs/testing';
import { CataloguesController } from './catalogues.controller';
import { CataloguesService } from './catalogues.service';

describe('CataloguesController', () => {
  let controller: CataloguesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CataloguesController],
      providers: [CataloguesService],
    }).compile();

    controller = module.get<CataloguesController>(CataloguesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
