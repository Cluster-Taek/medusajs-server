import { StepResponse, WorkflowResponse, createStep, createWorkflow } from '@medusajs/framework/workflows-sdk';
import { BRAND_MODULE } from 'src/modules/brand';
import BrandModuleService from 'src/modules/brand/service';

export type CreateBrandInput = {
  name: string;
  description?: string;
};

export const createBrandStep = createStep(
  // step name
  'create-brand-step',
  // step handler
  async ({ name, description }: CreateBrandInput, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE);

    const brand = await brandModuleService.createBrands({
      name,
      description,
    });

    return new StepResponse(brand, brand);
  },
  // rollback when the step fails
  async (brand, { container }) => {
    const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE);

    return brandModuleService.deleteBrands(brand.id);
  }
);

export const createBrandWorkflow = createWorkflow('create-brand', (input: CreateBrandInput) => {
  const brand = createBrandStep(input);
  return new WorkflowResponse(brand);
});
