'use client';

import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onViewDetails: (projectId: string) => void;
}

export function ProjectList({ projects, onViewDetails }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-lg mt-6">
        <h2 className="text-xl font-semibold">尚無專案</h2>
        <p className="text-muted-foreground mt-2">點擊「新增專案」以開始。</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
