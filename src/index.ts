import type { ShikiTransformer } from "@shikijs/types";
import type { ElementContent, Root } from "hast";

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
 * Wraps the first `<pre>` element in a `<div>` with the specified class.
 */
const wrapPreWithBlock = (node: Root, classBlock: string): void => {
  const firstChild = node.children[0];

  if (
    firstChild &&
    firstChild.type === "element" &&
    firstChild.tagName === "pre"
  ) {
    node.children = [
      {
        type: "element",
        tagName: "div",
        properties: {
          class: classBlock,
        },
        children: [...node.children.map((child) => child as ElementContent)],
      },
    ];
  }
};

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
        const titleElement: ElementContent = {
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
        };

        wrapPreWithBlock(node, classBlock);

        const child = node.children[0];

        if (child && child.type === "element") {
          child.children = [titleElement, ...child.children];
        }
      }
    },
  };
};
