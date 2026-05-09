# Pit Wall Proxy 🛠️

A high-performance Cloudflare Worker acting as the data backbone for the Formula 1 dashboard. It handles multi-source API proxying, data deduplication, and complex RSS parsing.

## 📡 Functionality
- **CORS Management:** Enables secure frontend communication with OpenF1 and Jolpica.
- **Smart Parsing:** Custom regex-based RSS engine for F1-specific news and media extraction.
- **Data Normalization:** Merges multiple OpenF1 streams into clean payloads for the telemetry grid.

## 🚀 Routes
- `/v1/telemetry`: Latest car intervals and race gaps.
- `/v1/car_data`: Real-time mechanical telemetry (Speed, RPM, Gear).
- `/v1/positions`: Official session rankings and order.
- `/v1/session_results`: Post-race classifications and points.
- `/v1/race-control`: Live FIA race control and steward messages.
- `/v1/weather`: Real-time track and air conditions.
- `/v1/radio`: Team radio audio recordings and timestamps.
- `/v1/stints`: Tyre compound tracking and lap age.
- `/v1/pits`: Pit stop durations and box entry timeline.
- `/v1/news`: F1 news parsed from official and Autosport feeds.
- `/v1/calendar`: Full season schedule from Jolpica.

## 🛠️ Development
```bash
npm run dev # Runs on http://localhost:8787
npm run deploy # Deploys to Cloudflare edge
```
