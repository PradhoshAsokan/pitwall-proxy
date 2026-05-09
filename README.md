# Pit Wall Proxy 🛠️

A high-performance Cloudflare Worker acting as the data backbone for the Formula 1 dashboard. It handles multi-source API proxying, data deduplication, and complex RSS parsing.

## 📡 Functionality
- **CORS Management:** Enables secure frontend communication with OpenF1 and Jolpica.
- **Smart Parsing:** Custom regex-based RSS engine for F1-specific news and media extraction.
- **Data Normalization:** Merges multiple OpenF1 streams into clean payloads for the telemetry grid.

## 🚀 Routes
- `/test/telemetry`: Latest car intervals and race gaps.
- `/test/car_data`: Real-time mechanical telemetry (Speed, RPM, Gear).
- `/test/positions`: Official session rankings and order.
- `/test/session_results`: Post-race classifications and points.
- `/test/race-control`: Live FIA race control and steward messages.
- `/test/weather`: Real-time track and air conditions.
- `/test/radio`: Team radio audio recordings and timestamps.
- `/test/stints`: Tyre compound tracking and lap age.
- `/test/pits`: Pit stop durations and box entry timeline.
- `/test/news`: F1 news parsed from official and Autosport feeds.
- `/test/calendar`: Full season schedule from Jolpica.

## 🛠️ Development
```bash
npm run dev # Runs on http://localhost:8787
npm run deploy # Deploys to Cloudflare edge
```
