import { ProtectedComponent } from '@/components/ProtectedComponent';
import MePage from '@/components/views/Me';

const Page = () => {
  return (
    <ProtectedComponent>
      <MePage />
    </ProtectedComponent>
  );
};

export default Page;
