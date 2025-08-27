"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Task } from "../types";

export interface KanbanCardProps {
  task: Task;
  isOverlay?: boolean;
}

export const KanbanCard = ({ task, isOverlay }: KanbanCardProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const containerStyle = cva("px-4 py-2", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={containerStyle({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="px-0 py-2 relative">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 -ml-2 h-auto cursor-grab absolute right-0"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
      </CardHeader>
      <CardContent className="px-0 py-2 text-sm whitespace-pre-wrap">
        {task.title}
      </CardContent>
    </Card>
  );
};
