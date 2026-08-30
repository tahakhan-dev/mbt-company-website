"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  TextB,
  TextItalic,
  TextHOne,
  TextHTwo,
  ListBullets,
  ListNumbers,
  Quotes,
} from "@phosphor-icons/react/dist/ssr";
import type { RichText } from "@/lib/schemas/common";
import { cn } from "@/lib/utils/format";

/**
 * Compact Tiptap editor for the rich content fields. Emits Tiptap doc JSON;
 * the public site renders it via generateHTML + sanitize.
 */
export function RichTextEditor({
  value,
  onChange,
  minHeight = 160,
}: {
  value: RichText;
  onChange: (doc: NonNullable<RichText>) => void;
  minHeight?: number;
}) {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [2, 3] } })],
    content: (value as object | null) ?? { type: "doc", content: [] },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "rich-text focus:outline-none px-4 py-3 text-sm",
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getJSON() as NonNullable<RichText>),
  });

  if (!editor) {
    return (
      <div
        className="animate-pulse rounded-lg bg-white/[0.04] ring-1 ring-white/10"
        style={{ minHeight: minHeight + 42 }}
      />
    );
  }

  const btn = (active: boolean) =>
    cn(
      "grid size-7 place-items-center rounded text-ink-muted transition-colors",
      active ? "bg-white/12 text-ink" : "hover:bg-white/6 hover:text-ink",
    );

  return (
    <div className="overflow-hidden rounded-lg bg-white/[0.05] ring-1 ring-white/10 focus-within:ring-2 focus-within:ring-aurora-cyan/60">
      <div className="flex items-center gap-1 border-b border-white/8 px-2 py-1.5" role="toolbar" aria-label="Formatting">
        <button type="button" aria-label="Bold" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>
          <TextB className="size-3.5" />
        </button>
        <button type="button" aria-label="Italic" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <TextItalic className="size-3.5" />
        </button>
        <span className="mx-1 h-4 w-px bg-white/10" />
        <button type="button" aria-label="Heading 2" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          <TextHOne className="size-3.5" />
        </button>
        <button type="button" aria-label="Heading 3" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          <TextHTwo className="size-3.5" />
        </button>
        <span className="mx-1 h-4 w-px bg-white/10" />
        <button type="button" aria-label="Bullet list" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <ListBullets className="size-3.5" />
        </button>
        <button type="button" aria-label="Numbered list" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListNumbers className="size-3.5" />
        </button>
        <button type="button" aria-label="Quote" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          <Quotes className="size-3.5" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
