import { transformerNotationDiff } from "@shikijs/transformers";
import { createHighlighter } from "shiki";
import { expect, it } from "vitest";
import { transformerTitle } from "../src";
import { fixture1, fixture2 } from "./fixture";

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

  await expect(result).toMatchFileSnapshot("./output/case1.html");
});

it("case2", async () => {
  const shiki = await createHighlighter({
    langs: ["ts"],
    themes: ["github-dark"],
  });

  const result = shiki.codeToHtml(fixture2, {
    lang: "ts",
    theme: "github-dark",
    meta: {
      __raw: 'title="index.ts"',
    },
    transformers: [
      transformerNotationDiff({ matchAlgorithm: "v3" }),
      transformerTitle(),
    ],
  });

  await expect(result).toMatchFileSnapshot("./output/case2.html");
});
