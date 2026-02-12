// scripts/gen-theme.mjs
// 產生 css/material-theme.css（Material 3 tokens）
// 用法：
//   npm run gen:theme
// 或指定主色：
//   SOURCE_COLOR="#2FB6C4" npm run gen:theme
//
// 你也可以把 SOURCE_COLOR 換成你自己的色票（例如 #ff5a3d）

import fs from "fs";
import path from "path";
import { argbFromHex, hexFromArgb, themeFromSourceColor } from "@material/material-color-utilities";

const SOURCE = process.env.SOURCE_COLOR || "#2FB6C4";
const theme = themeFromSourceColor(argbFromHex(SOURCE), []);

// 常用 sys color tokens（先生成最實用的一組）
const keys = [
  "primary","onPrimary","primaryContainer","onPrimaryContainer",
  "secondary","onSecondary","secondaryContainer","onSecondaryContainer",
  "tertiary","onTertiary","tertiaryContainer","onTertiaryContainer",
  "error","onError","errorContainer","onErrorContainer",
  "background","onBackground","surface","onSurface",
  "surfaceVariant","onSurfaceVariant",
  "outline","outlineVariant",
];

function toCssVars(scheme, prefix = "--md-sys-color-") {
  return keys.map(k => {
    const cssName = prefix + k.replace(/[A-Z]/g, m => "-" + m.toLowerCase());
    return `  ${cssName}: ${hexFromArgb(scheme[k])};`;
  }).join("\n");
}

const out = `/* Auto-generated Material 3 theme tokens. Source: ${SOURCE} */\n` +
`:root{\n${toCssVars(theme.schemes.light)}\n}\n\n` +
`@media (prefers-color-scheme: dark){\n  :root{\n${toCssVars(theme.schemes.dark)}\n  }\n}\n`;

const outPath = path.resolve("css/material-theme.css");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, "utf8");

console.log("Generated:", outPath);
