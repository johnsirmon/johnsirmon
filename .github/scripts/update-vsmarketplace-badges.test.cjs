const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');
const { extensions, getInstallCount, renderBadge, updateBadges } = require('./update-vsmarketplace-badges.cjs');

function listing(id, value) {
  const [publisherName, extensionName] = id.split('.');
  return { publisher: { publisherName }, extensionName, statistics: [{ statisticName: 'install', value }] };
}

function payload(...listings) {
  return { results: [{ extensions: listings }] };
}

function response(data) {
  return { ok: true, json: async () => data };
}

async function temporaryRoot(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'profile-badge-test-'));
  t.after(() => fs.rm(root, { recursive: true, force: true }));
  return root;
}

test('matches exact publisher and extension, regardless of response order', () => {
  const data = payload(listing(extensions[1].id, 4), listing('another.bloodloss', 99), listing(extensions[0].id, 219));
  assert.equal(getInstallCount(data, extensions[0].id), 219);
  assert.equal(getInstallCount(data, extensions[1].id), 4);
});

test('accepts zero installs', () => {
  assert.equal(getInstallCount(payload(listing(extensions[0].id, 0)), extensions[0].id), 0);
});

test('rejects malformed results and missing, wrong or duplicate identities', () => {
  const id = extensions[0].id;
  for (const data of [
    null, {}, { results: {} }, { results: [null] }, { results: [{}] },
    payload(), payload(listing(extensions[1].id, 1)),
    payload(listing(id, 1), listing(id, 2)),
  ]) {
    assert.throws(() => getInstallCount(data, id), /Malformed|Expected exactly one/);
  }
});

test('rejects missing, duplicate and invalid install statistics', () => {
  const id = extensions[0].id;
  for (const value of [undefined, null, '4', -1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(() => getInstallCount(payload(listing(id, value)), id), /Invalid or missing/);
  }
  for (const statistics of [undefined, {}, [], [{ statisticName: 'rating', value: 5 }], [
    { statisticName: 'install', value: 2 }, { statisticName: 'install', value: 3 },
  ]]) {
    assert.throws(() => getInstallCount(payload({ ...listing(id, 1), statistics }), id), /Invalid or missing/);
  }
});

test('renders deterministic JSON and accessible SVG with escaped text', () => {
  const extension = { ...extensions[0], label: 'Theme <test> & "icons"' };
  const badge = renderBadge(extension, 12345);
  assert.deepEqual(JSON.parse(badge.json), {
    schemaVersion: 1, label: extension.label, message: '12345', color: 'blue',
  });
  assert.match(badge.svg, /aria-label="Theme &lt;test&gt; &amp; &quot;icons&quot;: 12,345"/);
  assert.match(badge.svg, /<title>Theme &lt;test&gt; &amp; &quot;icons&quot;: 12,345<\/title>/);
  assert.deepEqual(renderBadge(extension, 12345), badge);
});

test('fetches both IDs and writes four correctly mapped badge files', async (t) => {
  const root = await temporaryRoot(t);
  const requests = [];
  const counts = new Map([[extensions[0].id, 219], [extensions[1].id, 0]]);
  const fetchImpl = async (url, options) => {
    assert.match(url, /^https:\/\/marketplace\.visualstudio\.com\//);
    assert.equal(options.method, 'POST');
    const body = JSON.parse(options.body);
    const id = body.filters[0].criteria[0].value;
    assert.equal(body.filters[0].criteria[0].filterType, 7);
    assert.ok(options.signal instanceof AbortSignal);
    requests.push(id);
    return response(payload(listing(id, counts.get(id))));
  };
  assert.deepEqual(await updateBadges({ root, fetchImpl }), extensions.map(({ id }) => ({ id, installs: counts.get(id) })));
  assert.deepEqual(requests.sort(), extensions.map(({ id }) => id).sort());
  const directory = path.join(root, 'badges');
  assert.equal((await fs.readdir(directory)).length, 4);
  for (const extension of extensions) {
    const expected = renderBadge(extension, counts.get(extension.id));
    for (const format of ['json', 'svg']) {
      assert.equal(await fs.readFile(path.join(directory, `${extension.basename}.${format}`), 'utf8'), expected[format]);
    }
  }
});

test('a failure of either lookup preserves all previous files', async (t) => {
  for (const failed of extensions) {
    for (const failure of ['http', 'network', 'json', 'missing', 'invalid']) {
      await t.test(`${failed.id}: ${failure}`, async (t) => {
        const root = await temporaryRoot(t);
        const directory = path.join(root, 'badges');
        await fs.mkdir(directory);
        const names = extensions.flatMap(({ basename }) => [`${basename}.json`, `${basename}.svg`]);
        for (const name of names) await fs.writeFile(path.join(directory, name), `previous ${name}`);
        const fetchImpl = async (_url, options) => {
          const id = JSON.parse(options.body).filters[0].criteria[0].value;
          if (id !== failed.id) return response(payload(listing(id, 500)));
          if (failure === 'http') return { ok: false, status: 503, statusText: 'Unavailable' };
          if (failure === 'network') throw new Error('Network unavailable');
          if (failure === 'json') return { ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } };
          if (failure === 'missing') return response(payload());
          return response(payload(listing(id, -1)));
        };
        await assert.rejects(updateBadges({ root, fetchImpl }), /failed: 503|Network unavailable|Invalid JSON|Expected exactly one|Invalid or missing/);
        assert.deepEqual((await fs.readdir(directory)).sort(), names.sort());
        for (const name of names) {
          assert.equal(await fs.readFile(path.join(directory, name), 'utf8'), `previous ${name}`);
        }
      });
    }
  }
});
