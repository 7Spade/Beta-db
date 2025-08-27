import { KanbanBoard } from "../components/kanban-board";
import { columns, tasks } from "../data";

export const KanbanView = () => {
    return <KanbanBoard columns={columns} tasks={tasks} />
}
