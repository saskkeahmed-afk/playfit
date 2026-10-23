// يولّد ملفات PNG/ICO من ملفات SVG في هذا الفولدر ويضعها في الأماكن الصحيحة.
// التشغيل: node brand/export.mjs   (يتطلب حزمة sharp، وهي موجودة مع Next)
import sharp from "sharp";
import { readFileSync, writeFileSync, copyFileSync } from "node:fs";

const mark = readFileSync("brand/logo-mark.svg");
const full = readFileSync("brand/logo-full.svg");
const og = readFileSync("brand/og.svg");

const png = (svg, w, h) => sharp(svg, { density: 300 }).resize(w, h, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();

writeFileSync("brand/logo-mark-512.png", await png(mark, 512, 512));
writeFileSync("brand/logo-full-1120x256.png", await png(full, 1120, 256));
writeFileSync("brand/og-1200x630.png", await sharp(og, { density: 144 }).resize(1200, 630).png().toBuffer());

// ملفات Next (تُخدم تلقائياً بحسب اسمها داخل src/app)
copyFileSync("brand/logo-mark.svg", "src/app/icon.svg");
writeFileSync("src/app/apple-icon.png", await png(mark, 180, 180));
copyFileSync("brand/og-1200x630.png", "src/app/opengraph-image.png");
copyFileSync("brand/og-1200x630.png", "src/app/twitter-image.png");

// favicon.ico: حاوية ICO بصورة PNG بحجم 48
const p48 = await png(mark, 48, 48);
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4);
header.writeUInt8(48, 6); header.writeUInt8(48, 7); header.writeUInt8(0, 8); header.writeUInt8(0, 9);
header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); header.writeUInt32LE(p48.length, 14); header.writeUInt32LE(22, 18);
writeFileSync("src/app/favicon.ico", Buffer.concat([header, p48]));
console.log("brand assets exported");
