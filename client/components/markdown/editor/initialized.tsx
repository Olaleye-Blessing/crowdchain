"use client";

import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  UndoRedo,
  BoldItalicUnderlineToggles,
  linkDialogPlugin,
  CreateLink,
  linkPlugin,
  BlockTypeSelect,
  tablePlugin,
  InsertTable,
  ListsToggle,
  directivesPlugin,
  AdmonitionDirectiveDescriptor,
  InsertThematicBreak,
  InsertAdmonition,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { cn } from "@/lib/utils";

export default function InitializedMDXEditor({
  editorRef,
  plugins,
  className,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      className={cn("cc_mdx", className)}
      plugins={[
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor],
        }),
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        linkDialogPlugin(),
        linkPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              {" "}
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CreateLink />
              <BlockTypeSelect />
              <InsertTable />
              <ListsToggle />
              <InsertThematicBreak />
              <InsertAdmonition />
            </>
          ),
        }),
        ...(plugins || []),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
