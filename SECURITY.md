# Security Policy

This project ships prompt instructions (markdown), static HTML/SVG
examples, and a small Node render script. The main things worth reporting:

- Anything that could make the render script (`scripts/render.mjs`) fetch
  or execute content beyond the local input file and Google Fonts.
- Example or template HTML that includes external scripts or exfiltrates
  data when opened.
- Prompt-injection payloads hidden in skill files or examples.

## Reporting

Please use GitHub's private vulnerability reporting on this repository
("Security" tab → "Report a vulnerability") rather than a public issue.
You'll get a response within a week.

Only the latest release on `main` is supported.
