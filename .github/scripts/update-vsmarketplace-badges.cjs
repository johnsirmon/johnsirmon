const fs = require('node:fs/promises');
const path = require('node:path');

const extensions = [
  {
    id: 'shark-labs.shark-labs-great-white-theme',
    label: 'Great White installs',
    basename: 'vscode-installs',
    color: 'blue',
    fill: '#007ec6',
  },
  {
    id: 'shark-labs.bloodloss',
    label: 'Bloodloss installs',
    basename: 'bloodloss-installs',
    color: 'red',
    fill: '#b52b42',
  },
];
const endpoint = 'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=7.2-preview.1';

function getInstallCount(data, extensionId) {
  if (!Array.isArray(data?.results) ||
      data.results.some((result) => !Array.isArray(result?.extensions))) {
    throw new Error(`Malformed Marketplace response for ${extensionId}.`);
  }
  const matches = data.results.flatMap((result) => result.extensions).filter(
    (extension) => `${extension?.publisher?.publisherName}.${extension?.extensionName}` === extensionId,
  );
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one Marketplace extension matching ${extensionId}.`);
  }
  const statistics = matches[0].statistics;
  const installs = Array.isArray(statistics)
    ? statistics.filter((stat) => stat?.statisticName === 'install')
    : [];
  if (installs.length !== 1 || !Number.isSafeInteger(installs[0].value) || installs[0].value < 0) {
    throw new Error(`Invalid or missing install statistic for ${extensionId}.`);
  }
  return installs[0].value;
}

function escapeXml(text) {
  return text.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[character]);
}

function renderBadge(extension, installs) {
  const label = escapeXml(extension.label);
  const message = installs.toLocaleString('en-US');
  const leftWidth = Math.max(120, Math.round(extension.label.length * 6.7 + 20));
  const rightWidth = Math.max(42, Math.round(message.length * 7 + 16));
  const width = leftWidth + rightWidth;
  const leftCenter = Math.round(leftWidth / 2);
  const rightCenter = leftWidth + Math.round(rightWidth / 2);
  return {
    json: JSON.stringify({
      schemaVersion: 1,
      label: extension.label,
      message: String(installs),
      color: extension.color,
    }, null, 2) + '\n',
    svg: `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="20" role="img" aria-label="${label}: ${message}">
  <title>${label}: ${message}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#fff" stop-opacity=".7"/>
    <stop offset=".1" stop-color="#aaa" stop-opacity=".1"/>
    <stop offset=".9" stop-color="#000" stop-opacity=".3"/>
    <stop offset="1" stop-color="#000" stop-opacity=".5"/>
  </linearGradient>
  <clipPath id="r"><rect width="${width}" height="20" rx="3" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="20" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="20" fill="${escapeXml(extension.fill)}"/>
    <rect width="${width}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text x="${leftCenter}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${leftCenter}" y="14">${label}</text>
    <text x="${rightCenter}" y="15" fill="#010101" fill-opacity=".3">${message}</text>
    <text x="${rightCenter}" y="14">${message}</text>
  </g>
</svg>
`,
  };
}

async function fetchInstallCount(extensionId, fetchImpl) {
  const response = await fetchImpl(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filters: [{
        criteria: [{ filterType: 7, value: extensionId }],
        pageNumber: 1,
        pageSize: 1,
        sortBy: 0,
        sortOrder: 0,
      }],
      flags: 914,
    }),
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`Marketplace query for ${extensionId} failed: ${response.status} ${response.statusText}`);
  }
  return getInstallCount(await response.json(), extensionId);
}

async function updateBadges({
  root = path.resolve(__dirname, '..', '..'),
  fetchImpl = fetch,
} = {}) {
  // Stage all validated results in memory so a failed lookup cannot refresh only one badge.
  const results = await Promise.all(extensions.map(async (extension) => {
    const installs = await fetchInstallCount(extension.id, fetchImpl);
    return { extension, installs, ...renderBadge(extension, installs) };
  }));
  const directory = path.join(root, 'badges');
  await fs.mkdir(directory, { recursive: true });
  for (const result of results) {
    await fs.writeFile(path.join(directory, `${result.extension.basename}.json`), result.json);
    await fs.writeFile(path.join(directory, `${result.extension.basename}.svg`), result.svg);
  }
  return results.map(({ extension, installs }) => ({ id: extension.id, installs }));
}

if (require.main === module) {
  updateBadges().then((results) => {
    for (const result of results) console.log(`${result.id}: ${result.installs} installs`);
  }).catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

module.exports = { extensions, getInstallCount, renderBadge, updateBadges };
