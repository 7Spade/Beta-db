import { ProjectsView } from '@/features/(core-operations)/projects/views/projects-view';

export default async function ProjectsPage() {
  // The data fetching logic has been moved to the ProjectsView component itself.
  // This file is now a simple entry point, consistent with other pages.
  return <ProjectsView />;
}
