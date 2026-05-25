// Shiki stub file to prevent bundling 20MB+ of syntax highlighters on Cloudflare Workers
export async function codeToHtml(code: string, options: any) {
  return `<pre><code>${code}</code></pre>`;
}

export async function getHighlighter() {
  return {
    codeToHtml: (code: string) => `<pre><code>${code}</code></pre>`,
  };
}

export function createCssVariablesTheme() {
  return {};
}

export function createOnigurumaEngine() {
  console.warn("shiki stub: createOnigurumaEngine called");
  return {};
}

export const bundledLanguages = {};
export const bundledThemes = {};

export default {
  codeToHtml,
  getHighlighter,
  createCssVariablesTheme,
  createOnigurumaEngine,
  bundledLanguages,
  bundledThemes,
};
