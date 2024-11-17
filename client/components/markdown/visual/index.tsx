"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MDXVisualProps {
  markdown: string;
}

export default function MDXVisual({ markdown }: MDXVisualProps) {
  return (
    <div className="overflow-x-hidden">
      <Markdown
        className="mdx_visual"
        remarkPlugins={[remarkGfm]}
        components={{
          a(props) {
            const { node, className, ...rest } = props;
            return (
              <a
                {...rest}
                className={`${className} text-primary`}
                target="_blank"
                rel="noopener"
              />
            );
          },
          table(props) {
            const { node, className, ...rest } = props;
            return (
              <div className="my-4 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <table {...rest} className="simple_table" />
                  </div>
                </div>
              </div>
            );
          },
        }}
      >
        {markdown}
      </Markdown>
    </div>
  );
}
