'use client'; // Next.js directive: this component runs on the client side

// Import drag-and-drop utilities from dnd-kit
import {
  closestCenter,        // Collision detection algorithm: finds the closest drop target
  DndContext,           // Provides drag-and-drop context for child components
  DragEndEvent,         // Type for drag end event
  KeyboardSensor,       // Enables keyboard-based dragging
  PointerSensor,        // Enables mouse/touch dragging
  useSensor,            // Hook to configure a sensor
  useSensors,           // Hook to combine multiple sensors
} from '@dnd-kit/core';

import {
  arrayMove,                   // Utility to reorder array items
  SortableContext,              // Context for sortable items
  useSortable,                  // Hook to make an item draggable/sortable
  verticalListSortingStrategy,  // Strategy for vertical lists
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities'; // Utility for applying transforms
import cx from 'clsx';                    // Utility for conditional classNames
import { Text, Button, Divider } from '@mantine/core'; // Mantine UI components
import { useListState } from '@mantine/hooks';         // Mantine hook for list state
import classes from './DndList.module.css';            // CSS module for styling
import { useEffect } from 'react';

// Define the shape of a task
interface Task {
  name: string; // Task name
  key: string;  // Unique identifier for each task
}

// Props for each sortable item
interface ItemProps {
  item: Task;
  index: number; // Index in the list (not used here, but available)
  onDeleteTask: (key: string) => void; // Callback to delete a task
}

// Component for a single draggable item
function SortableItem({ item, onDeleteTask }: ItemProps) {
  // Hook that makes this item sortable
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.key, // Use the task key as the draggable ID
  });

  // Apply transform and transition styles for smooth dragging
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef} // Ref connects DOM node to dnd-kit
      style={style}    // Apply drag styles
      className={cx(classes.item, { [classes.itemDragging]: isDragging })} // Add dragging class
      {...attributes}  // Accessibility attributes
      {...listeners}   // Event listeners for drag actions
    >
      {/* Layout: delete button + divider + task text */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          size="xs"
          variant="outline"
          color="red"
          onClick={() => onDeleteTask(item.key)} // Delete task when clicked
        >
          Delete
        </Button>
        <Divider orientation="vertical" mx="xs" />
        <Text>{item.name}</Text>
      </div>
    </div>
  );
}

// Props for the todo list
interface TodoListProps {
  tasks: Task[]; // Array of tasks
  onDeleteTask: (key: string) => void; // Callback to delete a task
}

// Main TodoList component
export function TodoList({ tasks, onDeleteTask }: TodoListProps) {
  // Mantine hook to manage list state
  const [state, handlers] = useListState(tasks);

  // Sync local state whenever tasks prop changes
  useEffect(() => {
    handlers.setState(tasks);
  }, [tasks, handlers]);

  // Configure sensors: pointer (mouse/touch) and keyboard
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // drag starts after moving 5px
    useSensor(KeyboardSensor) // keyboard drag support
  );

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return; // Do nothing if dropped outside or on itself
    }

    // Find old and new positions of the dragged item
    const oldIndex = state.findIndex((i) => i.key === active.id);
    const newIndex = state.findIndex((i) => i.key === over.id);

    // Reorder state using arrayMove
    handlers.setState(arrayMove(state, oldIndex, newIndex));
  };

  return (
    // Provide drag-and-drop context
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {/* Sortable context: defines which items are sortable */}
      <SortableContext items={state.map((i) => i.key)} strategy={verticalListSortingStrategy}>
        {/* Render each task as a SortableItem */}
        {state.map((item, index) => (
          <SortableItem key={item.key} item={item} index={index} onDeleteTask={onDeleteTask} />
        ))}
      </SortableContext>
    </DndContext>
  );
}