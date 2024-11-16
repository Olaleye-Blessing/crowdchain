"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import "./mdx.css";

const InitializedEditor = dynamic(() => import("./initialized"), {
  ssr: false,
});

export const MDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>(
  (props, ref) => <InitializedEditor {...props} editorRef={ref} />,
);

MDXEditor.displayName = "MDXEditor";
