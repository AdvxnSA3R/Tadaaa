'use client';

import {useState} from 'react';

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
import { ActionIcon, Group, Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import classes from './DndList.module.css';

import { IconTrash, IconPinned, IconPin } from '@tabler/icons-react';

interface ItemProps {
  item: { name: string; key: string; pinned?: boolean };
  index: number;
  handlers: any;
  togglePin: (index: number) => void;
}

function SortableItem({ item, index, handlers, togglePin }: ItemProps) {
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
      className={cx(classes.item, { [classes.itemDragging]: isDragging, [classes.itemPinned]: item.pinned })}
    >
      <Group style={{ flexGrow: 1 }} {...attributes} {...listeners}>
        <Text>{item.name}</Text>
      </Group>
      <ActionIcon onClick={() => togglePin(index)} variant="subtle" title={item.pinned ? 'Unpin item' : 'Pin item'}>
        {item.pinned ? <IconPinned size="1.25rem" /> : <IconPin size="1.25rem" />}
      </ActionIcon>
      <ActionIcon onClick={() => handlers.remove(index)} variant="subtle" title="Delete item">
        <IconTrash size="1.25rem" />
      </ActionIcon>
    </div>
  );
}

export function TodoList({ todos, handlers, togglePin }: { todos: ItemProps['item'][]; handlers: any; togglePin: (index: number) => void }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }
    const oldIndex = todos.findIndex((i) => i.key === active.id);
    const newIndex = todos.findIndex((i) => i.key === over.id);
    handlers.setState(arrayMove(todos, oldIndex, newIndex));
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sortedTodos.map((i) => i.key)} strategy={verticalListSortingStrategy}>
        {sortedTodos.map((item, index) => (
          <SortableItem key={item.key} item={item} index={todos.indexOf(item)} handlers={handlers} togglePin={togglePin} />
        ))}
      </SortableContext>
    </DndContext>
  );
}