# Northern Variables Artifacts

This repository contains the production-ready HTML artifacts that power the interactive experiences on [artifacts.northernvariables.ca](https://artifacts.northernvariables.ca). The site curates data stories, public opinion tools, and policy explainers produced by Northern Variables for use across newsrooms, client deliverables, and the main corporate site.

Each artifact is a self-contained page with all required scripts, styles, and data. The repository is published directly to GitHub Pages, so commits to `main` are automatically deployed.

## 📁 Key Directories & Files

- `index.html` – Landing page and directory listing for every live artifact.
- `assets/` – Shared static assets such as SVG maps and party logos.
- `canada-federal-election-45-tracker.html`, `canada-map.html`, `canadian-identity-network.html`, etc. – Individual interactive explainers and dashboards.
- `vote-spectrum/` – Source files for the Vote Spectrum survey experience, including React components and data modules that are bundled for the published `vote-spectrum.html` page.
- `submission-widget.js` – Lightweight embed script used for form integrations across artifacts.
- `_template.html` – Base HTML shell used by the automation pipeline when new artifacts are generated.

## 🛠️ How New Artifacts Are Added

Artifacts are produced through the Codex automation workflow: prompts and configuration files live in the private operations repository, and Codex writes the compiled HTML (and any supporting assets) directly into this project. Manual setup steps are no longer required.

If you need to introduce a new interactive outside the automated flow:

1. Duplicate `_template.html` and rename the copy to match your artifact.
2. Drop in the generated markup/scripts or point to modules under `vote-spectrum/` if the experience is React-based.
3. Update `index.html` with a new card so the artifact appears on the landing page.
4. Commit the files on `main`; deployment is handled by GitHub Pages.

## 🧰 Technology Snapshot

- Static HTML exports with embedded React (via Babel Standalone) for interactive views.
- Tailwind CSS and utility-first styling baked into each artifact.
- Client-side JSON/JS modules for survey logic and data visualization.
- GitHub Pages for hosting and SSL.

## 📄 Licensing

All artifacts are © 2025 Northern Variables. Public viewing is permitted; reuse or redistribution requires written permission.

## 📬 Contact

- Website: [northernvariables.ca](https://northernvariables.ca)
- Email: [contact@northernvariables.ca](mailto:contact@northernvariables.ca)
- Updates: [axorc.substack.com](https://axorc.substack.com)

---

*Last updated: November 2025*
