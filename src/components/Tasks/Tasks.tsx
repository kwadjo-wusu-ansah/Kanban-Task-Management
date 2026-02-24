import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useAppSelector } from "../../store/hooks";
import { classNames, toColumnDragId, toTaskDragId } from "../../utils";
import styles from "./Tasks.module.css";
import type { TasksProps } from "./Tasks.types";
import { SortableTaskRow } from "./SortableTaskRow";
import { formatHeadingLabel } from "./Tasks.utils";

// Renders a reusable task stack using TaskCard items under a column-style heading.
function Tasks({
  accentColor = "var(--color-primary)",
  className,
  columnId,
  mode = "light",
  onTaskSelect,
  ...props
}: TasksProps) {
  const column = useAppSelector((state) => state.kanban.columns[columnId]);
  const taskIds = column?.taskIds ?? [];
  const sortableTaskIds = taskIds.map((taskId) => toTaskDragId(taskId));
  const heading = column?.name ?? "Untitled";
  const resolvedTaskCount = taskIds.length;
  const { isOver, setNodeRef } = useDroppable({
    id: toColumnDragId(columnId),
  });

  if (!column) {
    return null;
  }

  return (
    <section
      className={classNames(
        styles.root,
        isOver && styles.columnDropTarget,
        className,
      )}
      ref={setNodeRef}
      {...props}
    >
      <header className={styles.headingRow}>
        <span
          aria-hidden="true"
          className={styles.headingDot}
          style={{ backgroundColor: accentColor || column.accentColor }}
        />
        <h2 className={styles.headingText}>
          {formatHeadingLabel(heading, resolvedTaskCount)}
        </h2>
      </header>
      <SortableContext
        items={sortableTaskIds}
        strategy={verticalListSortingStrategy}
      >
        <ul className={styles.tasksList}>
          {taskIds.map((taskId) => (
            <SortableTaskRow
              key={taskId}
              mode={mode}
              onTaskSelect={onTaskSelect}
              taskId={taskId}
            />
          ))}
        </ul>
      </SortableContext>
    </section>
  );
}

export default Tasks;
