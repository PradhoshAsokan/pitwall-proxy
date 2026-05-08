export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // 1. Test OpenF1 (Live Race Data)
    // Grabbing driver intervals for a specific session
    if (url.pathname === "/test/telemetry") {
      const openF1Response = await fetch("https://api.openf1.org/v1/intervals?session_key=9165&interval>0&interval<0.005");
      const data = await openF1Response.json();
      return Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 2. Test Jolpica (The modern replacement for Ergast API)
    // Grabbing the 2026 current driver standings
    if (url.pathname === "/test/standings") {
      const jolpicaResponse = await fetch("https://api.jolpi.ca/ergast/f1/2026/driverStandings.json");
      const data = await jolpicaResponse.json();
      return Response.json({ source: "Jolpica API", status: "Success", data });
    }

    // 3. Test OpenF1 Race Control Messages
    if (url.pathname === "/test/race-control") {
      const response = await fetch("https://api.openf1.org/v1/race_control?session_key=latest");
      const data = await response.json();
      return Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 4. Test OpenF1 Weather
    if (url.pathname === "/test/weather") {
      const response = await fetch("https://api.openf1.org/v1/weather?session_key=latest");
      const data = await response.json();
      return Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 5. Test OpenF1 Stints (Tire Strategy)
    if (url.pathname === "/test/stints") {
      const response = await fetch("https://api.openf1.org/v1/stints?session_key=latest");
      const data = await response.json();
      return Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 6. Test RSS Feed (Crash.net 2026 F1 News)
    if (url.pathname === "/test/news") {
      const rssResponse = await fetch("https://www.crash.net/rss");
      const textData = await rssResponse.text();
      // We return the raw XML text just to prove we can fetch it; later we will parse it to JSON
      return new Response(textData, { headers: { "Content-Type": "text/xml" } });
    }

    // Default Router
    return Response.json({
      message: "Pit Wall Backend Running. Test routes:",
      routes: [
        "/test/telemetry",
        "/test/standings",
        "/test/race-control",
        "/test/weather",
        "/test/stints",
        "/test/news"
      ]
    });
  },
};