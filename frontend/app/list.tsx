'use client';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import cx from 'clsx';
import { Text, Button, Divider } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import classes from './DndList.module.css';
import { useEffect } from 'react';

interface Task {
  name: string;
  key: string;
}

interface ItemProps {
  item: Task;
  index: number; // kept if needed elsewhere
  onDeleteTask: (key: string) => void;
}

function SortableItem({ item, onDeleteTask }: ItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.key,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cx(classes.item, { [classes.itemDragging]: isDragging })}
      {...attributes}
      {...listeners}
    >
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button size="xs" variant="outline" color="red" onClick={() => onDeleteTask(item.key)}>Delete</Button>
        <Divider orientation="vertical" mx="xs" />
        <Text>{item.name}</Text>
      </div>
    </div>
  );
}

interface TodoListProps {
  tasks: Task[];
  onDeleteTask: (key: string) => void;
}

export function TodoList({ tasks, onDeleteTask }: TodoListProps) {
  const [state, handlers] = useListState(tasks);

  useEffect(() => {
    handlers.setState(tasks);
  }, [tasks, handlers]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = state.findIndex((i) => i.key === active.id);
    const newIndex = state.findIndex((i) => i.key === over.id);
    handlers.setState(arrayMove(state, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={state.map((i) => i.key)} strategy={verticalListSortingStrategy}>
        {state.map((item, index) => (
          <SortableItem key={item.key} item={item} index={index} onDeleteTask={onDeleteTask} />
        ))}
      </SortableContext>
    </DndContext>
  );
}