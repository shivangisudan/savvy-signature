// Downloads Savvy Signature's own partner badges and logo mark from their live site
// into public/brand before each build. Runs on Vercel and locally (npm run build).
// Missing files never fail the build: the page falls back to a text label.
import { mkdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'brand');
const BASE = 'https://savvysignatureindia.com/wp-content/uploads/';

const files = {
  's-mark.png': '2026/03/Group-1.png',
  'partners/google-partner.png': '2026/03/new-google-partner-badge-1.png',
  'partners/facebook-business-partner.png': '2026/03/fbpartners-1-1.png',
  'partners/microsoft-certified.jpg': '2026/03/MS-Certification-SS.jpg',
  'partners/shopify-partner.png': '2026/03/Certified-Shopify-Partner.png',
  'partners/certified-marketing-expert.jpg': '2026/03/Screenshot-2026-02-25-at-3.20.57-pm.jpg',
};

const exists = (p) => access(p).then(() => true, () => false);

let ok = 0, skipped = 0, failed = 0;
for (const [out, src] of Object.entries(files)) {
  const dest = join(root, out);
  if (await exists(dest)) { skipped++; continue; }
  try {
    const res = await fetch(BASE + src, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    ok++;
  } catch (err) {
    failed++;
    console.warn(`[brand] could not fetch ${out}: ${err.message} (page will show a text label)`);
  }
}
console.log(`[brand] fetched ${ok}, already present ${skipped}, unavailable ${failed}`);
