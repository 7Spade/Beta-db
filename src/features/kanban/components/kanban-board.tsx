
"use client";
import React, { useEffect, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { KanbanCard } from "./kanban-card";
import { KanbanColumn } from "./kanban-column";
import { type Column, Task } from "@/kanban/types";
import { useKanban } from "@/kanban/hooks/use-kanban";
import { createPortal } from "react-dom";

interface KanbanBoardProps {
  columns: Column[];
  tasks: Task[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onAddTask: (columnId: string, title: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export const KanbanBoard = ({ columns, tasks, setColumns, setTasks, onAddTask, onDeleteTask, onDeleteColumn }: KanbanBoardProps) => {
  const {
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
    activeColumn,
    activeTask,
    columnsId,
  } = useKanban(columns, tasks, setColumns, setTasks);
  
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
        <SortableContext items={columnsId}>
          {columns.map((col) => {
            const colTasks = tasks.filter((task) => task.status === col.id);
            return (
              <KanbanColumn 
                key={col.id} 
                column={col} 
                tasks={colTasks}
                onAddTask={onAddTask}
                onDeleteTask={onDeleteTask}
                onDeleteColumn={onDeleteColumn}
              />
            );
          })}
        </SortableContext>

      {isClient && createPortal(
        <DragOverlay>
          {activeColumn && (
            <KanbanColumn 
              column={activeColumn} 
              tasks={tasks.filter(task => task.status === activeColumn.id)}
              onAddTask={onAddTask}
              onDeleteTask={onDeleteTask}
              onDeleteColumn={onDeleteColumn}
            />
          )}
          {activeTask && <KanbanCard task={activeTask} onDeleteTask={onDeleteTask} />}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};
