import { LinkBrandToProduct } from './validators';
import { MedusaRequest, MedusaResponse } from '@medusajs/framework/http';
import { ContainerRegistrationKeys } from '@medusajs/framework/utils';
import { dismissProductsToBrandWorkflow } from 'src/workflows/dismiss-products-to-brand';
import { linkProductsToBrandWorkflow } from 'src/workflows/link-products-to-brand';
import { z } from 'zod';

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [product],
  } = await query.graph({
    entity: 'product',
    fields: ['brand.*'],
    filters: {
      id: req.params.id,
    },
  });

  res.json(product.brand ?? {});
};

type LinkBrandToProductType = z.infer<typeof LinkBrandToProduct>;

export const POST = async (req: MedusaRequest<LinkBrandToProductType>, res: MedusaResponse) => {
  const { result: link, errors } = await linkProductsToBrandWorkflow(req.scope).run({
    input: {
      productIds: [req.params.id],
      brandId: req.body.brandId,
    },
    throwOnError: false,
  });

  if (errors.length) {
    return res.status(400).send({
      errors: errors.map((error) => error.error.message),
    });
  }

  res.json({ link });
};

export const DELETE = async (req: MedusaRequest<LinkBrandToProductType>, res: MedusaResponse) => {
  const { result: link, errors } = await dismissProductsToBrandWorkflow(req.scope).run({
    input: {
      productIds: [req.params.id],
      brandId: req.body.brandId,
    },
    throwOnError: false,
  });

  if (errors.length) {
    return res.status(400).send({
      errors: errors.map((error) => error.error.message),
    });
  }

  res.json({ link });
};
