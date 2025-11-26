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
import { Text } from '@mantine/core';
import { useListState } from '@mantine/hooks';
import classes from './DndList.module.css';

const data = [
  { name: 'Carbon', key: 'C' },
  { name: 'Nitrogen', key: 'N'},
  { name: 'Yttrium', key: 'Y'},
  { name: 'Barium', key: 'B'},
  { name: 'Cerium', key: 'Cr'},
];
 console.log(data);
interface ItemProps {
  item: (typeof data)[number];
  index: number; // kept if needed elsewhere
}

function SortableItem({ item }: ItemProps) {
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
      
      <div>
        <Text>{item.name}</Text>
        
        
      </div>
    </div>
  );
}

export function TodoList() {
  const [state, handlers] = useListState(data);

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
          <SortableItem key={item.key} item={item} index={index} />
        ))}
      </SortableContext>
    </DndContext>
  );
}