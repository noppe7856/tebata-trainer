import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

async function build() {
  const [htmlTemplate, rawCss, bundleResult] = await Promise.all([
    fs.readFile(path.join(rootDir, 'index.html'), 'utf8'),
    fs.readFile(path.join(rootDir, 'src', 'styles.css'), 'utf8'),
    esbuild.build({
      entryPoints: [path.join(rootDir, 'src', 'main.js')],
      bundle: true,
      minify: true,
      treeShaking: true,
      format: 'iife',
      target: ['es2020'],
      write: false,
      legalComments: 'none'
    })
  ]);

  const cssResult = await esbuild.transform(rawCss, {
    loader: 'css',
    minify: true
  });

  const jsCode = bundleResult.outputFiles[0].text.replace(/<\/script>/gi, '<\\/script>');
  const cssCode = cssResult.code.replace(/<\/style>/gi, '<\\/style>');

  // Use replacer functions so '$' sequences inside minified code are never interpreted
  let finalHtml = htmlTemplate.replace(
    /<link\s+rel="stylesheet"\s+href="\.\/src\/styles\.css"\s*\/?>/i,
    () => `<style>\n${cssCode}\n  </style>`
  );
  finalHtml = finalHtml.replace(
    /<script\s+type="module"\s+src="\.\/src\/main\.js"><\/script>/i,
    () => `<script>\n${jsCode}\n  </script>`
  );

  await fs.mkdir(distDir, { recursive: true });
  const outPath = path.join(distDir, 'index.html');
  await fs.writeFile(outPath, finalHtml, 'utf8');

  const sizeKb = (Buffer.byteLength(finalHtml, 'utf8') / 1024).toFixed(1);
  console.log(`Built self-contained app -> ${outPath} (${sizeKb} KB)`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
