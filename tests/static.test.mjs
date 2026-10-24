import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const html = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
const catalog = JSON.parse(await readFile(new URL('../public/catalog.json', import.meta.url), 'utf8'));
const config = await readFile(new URL('../config/nginx.conf', import.meta.url), 'utf8');
test('Japanese language and UTF-8 are preserved', () => { assert.match(html, /lang="ja"/); assert.match(html, /charset="utf-8"/); assert.match(html, /東京ストア/); });
test('storefront displays both Japanese product names', () => { for (const item of catalog.products) assert.ok(html.includes(item.name)); });
test('catalog remains specific to Japan and yen', () => { assert.equal(catalog.currency, 'JPY'); assert.equal(catalog.region, 'JP'); });
test('prices remain positive whole yen amounts', () => { assert.equal(catalog.products.length, 2); for (const item of catalog.products) assert.ok(Number.isInteger(item.price_yen) && item.price_yen > 0); });
test('health contract remains ok', async () => assert.equal((await readFile(new URL('../public/health.txt', import.meta.url), 'utf8')).trim(), 'ok'));
test('nginx configuration uses an unprivileged port and tmp pid', () => { assert.match(config, /listen 8080;/); assert.match(config, /pid \/tmp\/nginx\.pid;/); });
test('configuration preserves UTF-8 and browser response headers', () => { assert.match(config, /charset utf-8;/); assert.match(config, /X-Content-Type-Options nosniff/); assert.match(config, /Content-Security-Policy/); });
test('stylesheet and catalog are local assets', async () => { assert.match(html, /href="\/style.css"/); assert.match(html, /href="\/catalog.json"/); assert.ok((await readFile(new URL('../public/style.css', import.meta.url), 'utf8')).length > 100); });
