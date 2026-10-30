"use client";

import { Button, PlusIcon } from "@/components/ui/button";
import { HeaderSelect, ModuleHeader } from "@/components/ui/primitives";

import { DEMO_MVP_PROJECTS } from "@/lib/mvp-studio/demo";
import type { MVPProject } from "@/lib/mvp-studio/types";

export function MVPStudioHeader({
  project,
  projects = DEMO_MVP_PROJECTS,
  onChangeProject,
  counts,
  onAddFeature,
  onDefineScope,
}: {
  project: MVPProject;
  projects?: MVPProject[];
  onChangeProject: (id: string) => void;
  counts: { total: number; inMvp: number; inProgress: number; completed: number };
  onAddFeature: () => void;
  onDefineScope: () => void;
}) {
  return (
    <ModuleHeader
      stage="04"
      stageLabel="Build"
      title="MVP Studio"
      description="Turn your validated idea into a focused, buildable first version by defining essential features, setting boundaries, and organizing product specifications."
      meta={[
        <span key="status" className="text-accent">
          {project.status}
        </span>,
        <span key="name" className="text-fg">
          {project.name}
        </span>,
        `${counts.total} proposed`,
        `${counts.inMvp} in MVP`,
        `${counts.inProgress} building`,
        `${counts.completed} done`,
      ]}
      controls={
        <HeaderSelect
          label="Idea"
          value={project.id}
          onChange={onChangeProject}
          ariaLabel="Select product idea for MVP Studio"
        >
          {projects.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} · {item.ref}
            </option>
          ))}
        </HeaderSelect>
      }
      actions={
        <>
          <Button variant="secondary" size="md" onClick={onDefineScope}>
            Define MVP Scope
          </Button>
          <Button variant="primary" size="md" onClick={onAddFeature}>
            <PlusIcon />
            Add Feature
          </Button>
        </>
      }
    />
  );
}
