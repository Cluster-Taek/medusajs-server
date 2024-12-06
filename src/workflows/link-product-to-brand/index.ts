import { BRAND_MODULE } from '../../modules/brand';
import { ContainerRegistrationKeys, Modules } from '@medusajs/framework/utils';
import { StepResponse, WorkflowResponse, createStep, createWorkflow } from '@medusajs/framework/workflows-sdk';
import BrandModuleService from 'src/modules/brand/service';

type LinkProductToBrandStepInput = {
  productId: string;
  brandId: string;
};

export const linkProductToBrandStep = createStep(
  'link-product-to-brand',
  async ({ productId, brandId }: LinkProductToBrandStepInput, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    const brandModuleService: BrandModuleService = container.resolve(BRAND_MODULE);
    await brandModuleService.retrieveBrand(brandId);

    await remoteLink.create({
      [Modules.PRODUCT]: {
        product_id: productId,
      },
      [BRAND_MODULE]: {
        brand_id: brandId,
      },
    });

    return new StepResponse(undefined, {
      productId,
      brandId,
    });
  },
  async ({ productId, brandId }, { container }) => {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK);

    remoteLink.dismiss({
      [Modules.PRODUCT]: {
        product_id: productId,
      },
      [BRAND_MODULE]: {
        brand_id: brandId,
      },
    });
  }
);

export const linkProductToBrandWorkflow = createWorkflow(
  'link-product-to-brand',
  (input: LinkProductToBrandStepInput) => {
    const link = linkProductToBrandStep(input);
    return new WorkflowResponse(link);
  }
);
