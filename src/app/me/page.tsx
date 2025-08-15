import { ProtectedComponent } from '@/components/ProtectedComponent';
import MePage from '@/components/views/Me';

const Page = () => {
  return (
    <ProtectedComponent>
      {({ user }) => <MePage user={user} />}
    </ProtectedComponent>
  );
};

export default Page;
