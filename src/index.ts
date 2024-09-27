import type { ShikiTransformer } from "@shikijs/types";
import type { ElementContent } from "hast";

export const parseTitleString = (meta: string): string | null => {
  if (!meta) return null;
  const match = meta.match(/title="([^"]+)"/);
  if (!match) return null;
  return match[1];
};

export interface TransformerTitleOptions {
  /**
   * The class of the code block.
   *
   * @default 'shiki-code-block'
   */
  classBlock?: string;

  /**
   * The class of the title.
   *
   * @default 'shiki-code-block-title'
   */
  classTitle?: string;
}

/**
 * Allow using `title="index.ts"` in the code snippet meta to add an extra file title.
 */
export const transformerTitle = (
  options: TransformerTitleOptions = {},
): ShikiTransformer => {
  const {
    classBlock = "shiki-code-block",
    classTitle = "shiki-code-block-title",
  } = options;

  return {
    name: "shiki-transformer-title",
    root(node) {
      if (!this.options.meta?.__raw) {
        return;
      }
      const title = parseTitleString(this.options.meta.__raw);

      if (title) {
        node.children = [
          {
            type: "element",
            tagName: "div",
            properties: {
              class: classBlock,
            },
            children: [
              {
                type: "element",
                tagName: "div",
                properties: {
                  class: classTitle,
                },
                children: [
                  {
                    type: "text",
                    value: title,
                  },
                ],
              },
              ...node.children.map((child) => child as ElementContent),
            ],
          },
        ];
      }
    },
  };
};
