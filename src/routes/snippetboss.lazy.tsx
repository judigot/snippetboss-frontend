import App from '@/App';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/snippetboss')({
  component: About,
});

function About() {
  return <App />;
}
