"use client";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { KanbanCard, type KanbanCardProps } from "./kanban-card";
import { type Column, type Task } from "../types";
import { useMemo } from "react";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { GripVertical } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  column: Column;
  tasks: KanbanCardProps["task"][];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const containerStyle = cva(
    "w-full max-w-sm flex flex-col flex-shrink-0",
    {
      variants: {
        dragging: {
          over: "ring-2 opacity-30",
          overlay: "ring-2 ring-primary",
        },
      },
    }
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={containerStyle({
        dragging: isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b flex flex-row items-center justify-between">
        <span>{column.title}</span>
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -mr-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move column</span>
          <GripVertical />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </CardContent>
    </Card>
  );
}
