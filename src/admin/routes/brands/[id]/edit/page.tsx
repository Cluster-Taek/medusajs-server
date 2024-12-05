import { SingleColumnLayout } from '../../../../layouts/single-column';
import QueryClientProvider from '../../../../providers/query-client-provider';
import BrandDetailContainer from '../brand-detail-container';
import BrandFormDrawer from './brand-form-drawer';
import { defineRouteConfig } from '@medusajs/admin-sdk';
import { TagSolid } from '@medusajs/icons';
import { useParams } from 'react-router';

const BrandsPage = () => {
  const { id } = useParams();

  return (
    <QueryClientProvider>
      <SingleColumnLayout>
        <BrandDetailContainer id={id} />
        <BrandFormDrawer id={id} />
      </SingleColumnLayout>
    </QueryClientProvider>
  );
};

export default BrandsPage;

export const config = defineRouteConfig({
  label: 'Brands',
  icon: TagSolid,
});
