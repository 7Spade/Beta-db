import { type Column, type Task } from "../types";

export const columns: Column[] = [
  {
    id: "todo",
    title: "Todo",
  },
  {
    id: "in-progress",
    title: "In Progress",
  },
  {
    id: "done",
    title: "Done",
  },
];

export const tasks: Task[] = [
  {
    id: "task-1",
    status: "todo",
    title: "Implement user authentication",
  },
  {
    id: "task-2",
    status: "todo",
    title: "Design database schema",
  },
  {
    id: "task-3",
    status: "in-progress",
    title: "Develop API for task management",
  },
  {
    id: "task-4",
    status: "in-progress",
    title: "Create UI components for kanban board",
  },
  {
    id: "task-5",
    status: "done",
    title: "Set up project structure",
  },
  {
    id: "task-6",
    status: "done",
    title: "Deploy staging environment",
  },
  {
    id: "task-7",
    status: "todo",
    title: "Write documentation for API endpoints",
  },
  {
    id: "task-8",
    status: "todo",
    title: "Implement drag-and-drop functionality",
  },
  {
    id: "task-9",
    status: "in-progress",
    title: "Test user authentication flow",
  },
  {
    id: "task-10",
    status: "done",
    title: "Configure CI/CD pipeline",
  },
];
