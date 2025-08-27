"use client";
import React, { useMemo } from "react";
import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  useSensor,
  useSensors,
  KeyboardSensor,
  Announcements,
  UniqueIdentifier,
  TouchSensor,
  MouseSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { KanbanCard, type KanbanCardProps } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";
import { type Column } from "../types";
import { useKanban } from "../hooks/use-kanban";
import { createPortal } from "react-dom";

interface KanbanBoardProps {
  columns: Column[];
  tasks: KanbanCardProps["task"][];
}

export const KanbanBoard = ({ columns, tasks }: KanbanBoardProps) => {
  const {
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
    activeColumn,
    activeTask,
    columnsId,
  } = useKanban(columns, tasks);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex gap-4">
        <SortableContext items={columnsId}>
          {columns.map((col) => {
            const colTasks = tasks.filter((task) => task.status === col.id);
            return <KanbanColumn key={col.id} column={col} tasks={colTasks} />;
          })}
        </SortableContext>
      </div>

      {createPortal(
        <DragOverlay>
          {activeColumn && (
            <KanbanColumn column={activeColumn} tasks={tasks.filter(task => task.status === activeColumn.id)} />
          )}
          {activeTask && <KanbanCard task={activeTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
