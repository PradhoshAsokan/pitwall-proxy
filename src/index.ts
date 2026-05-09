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

    // 1. OpenF1 (Live Race Data)
    if (url.pathname === "/v1/telemetry") {
      const openF1Response = await fetch("https://api.openf1.org/v1/intervals?session_key=latest");
      const data = await openF1Response.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    else if (url.pathname === "/v1/car_data") {
      const openF1Response = await fetch("https://api.openf1.org/v1/car_data?session_key=latest");
      const data = await openF1Response.json();
      const processedData = Array.isArray(data) ? data.slice(-50) : [];
      response = Response.json({ source: "OpenF1 API", status: "Success", data: processedData });
    }

    else if (url.pathname === "/v1/positions") {
      const openF1Response = await fetch("https://api.openf1.org/v1/position?session_key=latest");
      const data = await openF1Response.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    else if (url.pathname === "/v1/session_results") {
      const openF1Response = await fetch("https://api.openf1.org/v1/session_result?session_key=latest");
      const data = await openF1Response.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 2. Jolpica (Modern replacement for Ergast API)
    else if (url.pathname === "/v1/standings") {
      const jolpicaResponse = await fetch("https://api.jolpi.ca/ergast/f1/2026/driverStandings.json");
      const data = await jolpicaResponse.json();
      response = Response.json({ source: "Jolpica API", status: "Success", data });
    }

    else if (url.pathname === "/v1/calendar") {
      const jolpicaResponse = await fetch("https://api.jolpi.ca/ergast/f1/2026.json");
      const data = await jolpicaResponse.json();
      response = Response.json({ source: "Jolpica API", status: "Success", data });
    }

    else if (url.pathname === "/v1/constructors") {
      const jolpicaResponse = await fetch("https://api.jolpi.ca/ergast/f1/2026/constructorStandings.json");
      const data = await jolpicaResponse.json();
      response = Response.json({ source: "Jolpica API", status: "Success", data });
    }

    // 3. OpenF1 Events
    else if (url.pathname === "/v1/race-control") {
      const openF1Res = await fetch("https://api.openf1.org/v1/race_control?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    else if (url.pathname === "/v1/weather") {
      const openF1Res = await fetch("https://api.openf1.org/v1/weather?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    else if (url.pathname === "/v1/stints") {
      const openF1Res = await fetch("https://api.openf1.org/v1/stints?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    else if (url.pathname === "/v1/radio") {
      const openF1Res = await fetch("https://api.openf1.org/v1/team_radio?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    else if (url.pathname === "/v1/pits") {
      const openF1Res = await fetch("https://api.openf1.org/v1/pit?session_key=latest");
      const data = await openF1Res.json();
      response = Response.json({ source: "OpenF1 API", status: "Success", data });
    }

    // 4. RSS Feed (Autosport F1 News)
    else if (url.pathname === "/v1/news") {
      const rssResponse = await fetch("https://www.autosport.com/rss/f1/news");
      const xmlText = await rssResponse.text();
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
        message: "Purple Sector API v1.0.0. Active routes:",
        routes: [
          "/v1/telemetry",
          "/v1/car_data",
          "/v1/positions",
          "/v1/session_results",
          "/v1/standings",
          "/v1/calendar",
          "/v1/constructors",
          "/v1/race-control",
          "/v1/weather",
          "/v1/stints",
          "/v1/radio",
          "/v1/pits",
          "/v1/news"
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
