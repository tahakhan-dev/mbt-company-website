"use client";

import { useState, type ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical, CaretUp, CaretDown } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import { reorderContent } from "@/lib/admin/actions";
import { cn } from "@/lib/utils/format";

function Row({
  id,
  index,
  count,
  onMove,
  children,
}: {
  id: string;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  children: ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2 rounded-xl bg-surface px-3 py-2.5 ring-1 ring-white/8",
        isDragging && "z-10 opacity-80 ring-aurora-cyan/40",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
        className="cursor-grab rounded p-1 text-ink-faint hover:text-ink active:cursor-grabbing"
      >
        <DotsSixVertical className="size-4" aria-hidden="true" />
      </button>
      <div className="flex flex-col">
        <button
          type="button"
          aria-label="Move up"
          disabled={index === 0}
          onClick={() => onMove(index, index - 1)}
          className="rounded p-0.5 text-ink-faint hover:text-ink disabled:opacity-25"
        >
          <CaretUp className="size-3" aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label="Move down"
          disabled={index === count - 1}
          onClick={() => onMove(index, index + 1)}
          className="rounded p-0.5 text-ink-faint hover:text-ink disabled:opacity-25"
        >
          <CaretDown className="size-3" aria-hidden="true" />
        </button>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </li>
  );
}

/**
 * Reorderable list: drag (pointer/keyboard via dnd-kit) plus explicit
 * up/down buttons. Persists order via the reorder server action.
 */
export function SortableList<T extends { id: string }>({
  items: initial,
  collection,
  renderItem,
}: {
  items: T[];
  collection: string;
  renderItem: (item: T) => ReactNode;
}) {
  const [items, setItems] = useState(initial);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  async function persist(next: T[]) {
    setItems(next);
    const result = await reorderContent(collection, next.map((i) => i.id));
    if (result.ok) toast.success("Order saved");
    else {
      toast.error(result.error);
      setItems(initial);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    void persist(arrayMove(items, from, to));
  }

  function onMove(from: number, to: number) {
    void persist(arrayMove(items, from, to));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2" data-testid={`sortable-${collection}`}>
          {items.map((item, index) => (
            <Row key={item.id} id={item.id} index={index} count={items.length} onMove={onMove}>
              {renderItem(item)}
            </Row>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
