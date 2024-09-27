import { createHighlighter } from "shiki";
import { expect, it } from "vitest";
import { transformerTitle } from "../src";
import { fixture1 } from "./fixture";

it("case1", async () => {
  const shiki = await createHighlighter({
    langs: ["markdown"],
    themes: ["github-dark"],
  });

  const result = shiki.codeToHtml(fixture1, {
    lang: "markdown",
    theme: "github-dark",
    meta: {
      __raw: 'title="README.md"',
    },
    transformers: [transformerTitle()],
  });

  expect(result).toMatchFileSnapshot("./output/case1.html");
});
