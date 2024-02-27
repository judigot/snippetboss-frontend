import Prefixes from '@/components/prefix/Prefixes';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/prefixes/')({
  component: PrefixesRoute,
});

function PrefixesRoute() {
  return (
    <>
      <Prefixes />
    </>
  );
}
