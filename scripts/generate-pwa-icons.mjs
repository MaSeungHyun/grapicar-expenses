import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const src512 = join(publicDir, "icon-512.png");
const out192 = join(publicDir, "icon-192.png");

await sharp(src512).resize(192, 192).png().toFile(out192);
console.log("Created", out192);
