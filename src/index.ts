export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // CORS Headers
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle OPTIONS preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    let response: Response;

    // 1. Test OpenF1 (Live Race Data)
    // Grabbing driver intervals for the latest session
    if (url.pathname === "/test/telemetry") {
      const openF1Response = await fetch("https://api.openf1.org/v1/intervals?session_key=latest");
      const data = await openF1Response.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 1.1 Test OpenF1 Car Data (Mechanical Telemetry)
    else if (url.pathname === "/test/car_data") {
      const openF1Response = await fetch("https://api.openf1.org/v1/car_data?session_key=latest");
      const data = await openF1Response.json();
      // Safety check: Ensure data is an array before slicing
      const processedData = Array.isArray(data) ? data.slice(-50) : [];
      response = Response.json({ source: "OpenF1 API", status: "Success", data: processedData });
    }

    // 1.2 Test OpenF1 Positions
    else if (url.pathname === "/test/positions") {
      const openF1Response = await fetch("https://api.openf1.org/v1/position?session_key=latest");
      const data = await openF1Response.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 1.3 Test OpenF1 Session Results
    else if (url.pathname === "/test/session_results") {
      const openF1Response = await fetch("https://api.openf1.org/v1/session_result?session_key=latest");
      const data = await openF1Response.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 2. Test Jolpica (The modern replacement for Ergast API)
    // Grabbing the 2026 current driver standings
    else if (url.pathname === "/test/standings") {
      const jolpicaResponse = await fetch("https://api.jolpi.ca/ergast/f1/2026/driverStandings.json");
      const data = await jolpicaResponse.json();
      response = Response.json({ source: "Jolpica API", status: "Success", data });
    }

    // 2.1 Test Jolpica Calendar
    else if (url.pathname === "/test/calendar") {
      const jolpicaResponse = await fetch("https://api.jolpi.ca/ergast/f1/2026.json");
      const data = await jolpicaResponse.json();
      response = Response.json({ source: "Jolpica API", status: "Success", data });
    }

    // 2.2 Test Jolpica Constructors
    else if (url.pathname === "/test/constructors") {
      const jolpicaResponse = await fetch("https://api.jolpi.ca/ergast/f1/2026/constructorStandings.json");
      const data = await jolpicaResponse.json();
      response = Response.json({ source: "Jolpica API", status: "Success", data });
    }

    // 3. Test OpenF1 Race Control Messages
    else if (url.pathname === "/test/race-control") {
      const openF1Res = await fetch("https://api.openf1.org/v1/race_control?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 4. Test OpenF1 Weather
    else if (url.pathname === "/test/weather") {
      const openF1Res = await fetch("https://api.openf1.org/v1/weather?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 5. Test OpenF1 Stints (Tire Strategy)
    else if (url.pathname === "/test/stints") {
      const openF1Res = await fetch("https://api.openf1.org/v1/stints?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 5.1 Test OpenF1 Team Radio
    else if (url.pathname === "/test/radio") {
      const openF1Res = await fetch("https://api.openf1.org/v1/team_radio?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 5.2 Test OpenF1 Pit Stops
    else if (url.pathname === "/test/pits") {
      const openF1Res = await fetch("https://api.openf1.org/v1/pit?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 6. Test RSS Feed (Autosport F1 News)
    else if (url.pathname === "/test/news") {
      const rssResponse = await fetch("https://www.autosport.com/rss/f1/news");
      const xmlText = await rssResponse.text();

      // Simple Regex-based RSS parser for Cloudflare Worker environment
      const items = [];
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;

      while ((match = itemRegex.exec(xmlText)) !== null) {
        const itemContent = match[1];
        const title = itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/)?.[1] || 
                      itemContent.match(/<title>([\s\S]*?)<\/title>/)?.[1];
        const link = itemContent.match(/<link>([\s\S]*?)<\/link>/)?.[1];
        const pubDate = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
        const imageUrl = itemContent.match(/<enclosure url="([\s\S]*?)"/)?.[1];
        
        // Filter: only include if title contains F1 or related keywords
        const isF1 = title?.match(/F1|Formula 1|Verstappen|Hamilton|Leclerc|Norris|Grand Prix|GP/i);
        
        if (title && link && isF1) {
          items.push({
            title: title.trim(),
            link: link.trim(),
            date: pubDate ? new Date(pubDate).toLocaleDateString() : 'Recent',
            image: imageUrl || null
          });
        }
      }

      response = Response.json({ source: "Autosport F1 RSS", status: "Success", data: items.slice(0, 12) });
    }

    // Default Router
    else {
      response = Response.json({
        message: "Pit Wall Backend Running. Test routes:",
        routes: [
          "/test/telemetry",
          "/test/car_data",
          "/test/positions",
          "/test/standings",
          "/test/constructors",
          "/test/calendar",
          "/test/race-control",
          "/test/weather",
          "/test/stints",
          "/test/news"
        ]
      });
    }

    // Apply CORS headers to all responses
    const newHeaders = new Headers(response.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newHeaders.set(key, value);
    });

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  },
};
