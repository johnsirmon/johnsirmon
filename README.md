# John Sirmon

Escalation Engineer at Microsoft focused on production incident response, Azure observability, and telemetry-driven troubleshooting.

I build practical tools for triage and mitigation, from agentic support workflows to local-first, MCP-integrated systems — engineering for the technical and human realities of high-severity production incidents.

I like troubleshooting difficult systems, fixing things, and finding room for creativity.

[sirmon.ai](https://sirmon.ai) | [theSharkArtist.com](https://theSharkArtist.com) | [VS Code extensions](https://marketplace.visualstudio.com/publishers/shark-labs)

---

## Summary

- 20+ years of engineering and escalation experience across Microsoft, Oracle Cloud Infrastructure, and startup environments.
- Builds AI-assisted support tooling that connects case context, Kusto analytics, and internal guidance to accelerate triage and mitigation.
- Has operated across support, engineering, and product functions with a track record of shipping under production pressure.

---

## Published VS Code Extensions

Two themes from **The Shark Artist**. Source repositories are private; both extensions are publicly available on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/publishers/shark-labs).

### [Bloodloss](https://marketplace.visualstudio.com/items?itemName=shark-labs.bloodloss) — New

[![Bloodloss installs](badges/bloodloss-installs.svg)](https://marketplace.visualstudio.com/items?itemName=shark-labs.bloodloss)

Near-black surfaces, bone-white text, and crimson accents with a survival-horror identity. Includes semantic highlighting and original, optional file icons. A static theme: no runtime code, telemetry, or automatic settings changes.

### [Shark Artist: Great White Theme](https://marketplace.visualstudio.com/items?itemName=shark-labs.shark-labs-great-white-theme)

[![Great White installs](badges/vscode-installs.svg)](https://marketplace.visualstudio.com/items?itemName=shark-labs.shark-labs-great-white-theme)

Six ocean-inspired variants: Dark, Light, Storm, Frost, High Contrast Dark, and High Contrast Light. Luminance-led syntax hierarchy, semantic highlighting, and broad workbench coverage.

<details>
<summary>About the install badges</summary>

The [badge workflow](.github/workflows/update-vsmarketplace-badge.yml) refreshes both counts daily or on manual dispatch using the public Marketplace API. Counts reflect the last successful refresh, not live telemetry. If either lookup fails validation, existing badges remain unchanged and the workflow reports an error.

To maintain the badges locally with Node.js 22 or newer:

```sh
node --test .github/scripts/update-vsmarketplace-badges.test.cjs
node .github/scripts/update-vsmarketplace-badges.cjs
```

Extension IDs and labels live in the [shared generator](.github/scripts/update-vsmarketplace-badges.cjs). No Marketplace credentials are required.

</details>

---

## Selected Public Work

Curated September 16, 2026 from public projects updated in 2026.

### Support Engineering and Agent Tooling

- **[AMADiag](https://github.com/johnsirmon/AMADiag)** — Rust CLI and interactive terminal UI for analyzing Azure Monitor Agent troubleshooter bundles. Produces severity-ranked findings, evidence, remediation guidance, and Markdown/JSON reports.
- **[CPX](https://github.com/johnsirmon/CPX)** — Local-first Rust CLI for preparing support material for AI workflows. Replaces detected sensitive values with typed symbols, keeps mappings in an encrypted local vault, and rehydrates approved output locally. Detection still requires review before sharing.
- **[Support Context Protocol](https://github.com/johnsirmon/scp)** — Local-first CLI and MCP server for capturing, searching, and preparing support-case context for AI tools, with sensitive-data filtering and encrypted local storage.
- **[AI Dev Workstation](https://github.com/johnsirmon/ai-dev-workstation)** — Lightweight guide to Windows 11, WSL 2, VS Code, and agent-assisted development. A reference with validation scripts, not a framework or installer bundle.

### Exploration and Creative Tools

- **[AI Realm — explore the live atlas](https://johnsirmon.github.io/ai-realm-site/)** — A 3D fantasy atlas of AI technology. The [public site repository](https://github.com/johnsirmon/ai-realm-site) contains the published build; application source is private.
- **[Daily AI Developer Brief](https://github.com/johnsirmon/daily-ai-docs)** — Source-backed briefings and a podcast workflow for AI agent developers: what changed, why it matters, and whether to act, watch, or skip.
- **[FORScan Tools](https://github.com/johnsirmon/forscan_tools)** — Safety-first Python helpers for interpreting vehicle diagnostics and configuration artifacts, with source guidance and rollback-aware planning. Does not write to vehicles directly.
- **[Cricut Stencil Maker](https://github.com/johnsirmon/cricut-stencil-maker)** — Windows application that turns images into Design Space-compatible SVG stencils, including bridge generation and material presets.
- **[pyExtractHEIC](https://github.com/johnsirmon/pyExtractHEIC)** — Python CLI for extracting HEIC photos from iCloud zip exports and batch-converting them to PNG.

### Earlier Creative Work

- **[Inkscape PathBinder](https://github.com/johnsirmon/inkscape-pathbinder)** — Python extension that inserts configurable structural bridges into stencil paths so interior shapes stay connected when cut. Last updated in 2025.

**Hermes Agent achievements** — **5 Olympian** · **2 Diamond** · **2 Gold**

<details>
<summary>Achievement details · September 15, 2026</summary>

- **Olympian:** Model Sommelier, Claude Confidant, Screenshot Hunter, Test Suite Tamer, Toolset Cartographer.
- **Diamond:** Autonomous Avalanche, Config Surgeon.
- **Gold:** Plugin Goblin, Subagent Commander.

*Self-reported Hermes activity achievements, counted once per achievement. Not certifications or independently audited productivity metrics.*

</details>

---

## Career Highlights

- Created Azure Monitor Copilot v1, an early working RAG copilot for Azure Monitor Agent troubleshooting at Microsoft.
- Served on an early Microsoft cloud adoption team working with large enterprise customers as cloud development scaled into mainstream production workloads.
- Served in four Microsoft roles spanning support, engineering, product management, and escalation.
- Co-created the Analysis Services Maestros Program.
- Led architecture for an early Pivotal Cloud Foundry deployment in Azure China.
- Presented on big data, Power BI, and cloud AI architecture.
- Authored technical whitepapers on tabular models, NUMA affinity, and SSAS performance.

---

## Technical Stack

### Languages & Query

`Rust` · `Python` · `PowerShell` · `TypeScript` · `JavaScript` · `C#` · `KQL / Kusto` · `Bash`

### AI & Agent Systems

`MCP` · `GitHub Copilot` · `Claude Code` · `Codex CLI` · `Hermes Agent` · `RAG` · `Agent Skills & Tooling`

### Cloud, Observability & Support

`Azure` · `Azure Monitor` · `Azure Monitor Agent` · `Log Analytics` · `Incident Response` · `Telemetry Analysis`

### Development

`VS Code` · `Git` · `GitHub` · `GitHub Actions` · `Node.js` · `npm`

### Platforms

`Windows` · `Linux` · `WSL 2` · `Ubuntu`

### Creative & Fabrication

`GIMP` · `Inkscape` · `SVG / Vector Tooling` · `Cricut` · `MIG Welding`

---

## Shark Art

Outside of engineering, I create large-scale shark sculptures and mixed-media shark art.

[theSharkArtist.com](https://theSharkArtist.com)

---

## Contact

johnsirmon [at] hotmail [dot] com

[sirmon.ai](https://sirmon.ai)

github.com/johnsirmon

---

_"My secret weapon has always been understanding the data."_
