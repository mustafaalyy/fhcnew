const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sbFetch(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: options.prefer || "return=representation",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body}`);
  }

  const body = await response.text();
  return body ? JSON.parse(body) : null;
}

async function loadSiteValue(key) {
  const rows = await sbFetch(`site_content?key=eq.${encodeURIComponent(key)}&select=key,value,type,label,updated_at&limit=1`);
  if (!Array.isArray(rows) || rows.length === 0) return null;
  return rows[0];
}

async function saveSiteValue(key, value, label = "") {
  const payload = {
    key,
    value: JSON.stringify(value),
    type: "text",
    label,
    updated_at: new Date().toISOString()
  };

  const patched = await sbFetch(`site_content?key=eq.${encodeURIComponent(key)}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });

  if (Array.isArray(patched) && patched.length > 0) return patched[0];

  const inserted = await sbFetch("site_content", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return Array.isArray(inserted) ? inserted[0] : inserted;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  try {
    if (req.method === "GET") {
      const { key, resource } = req.query || {};

      if (resource === "bookings") {
        const bookings = await sbFetch("bookings?select=*&order=created_at.desc");
        return res.status(200).json({ ok: true, data: Array.isArray(bookings) ? bookings : [] });
      }

      if (!key) {
        return res.status(400).json({ ok: false, error: "Missing key" });
      }

      const row = await loadSiteValue(key);
      return res.status(200).json({ ok: true, data: row });
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const { action } = body;

      if (action === "saveSiteValue") {
        const row = await saveSiteValue(body.key, body.value, body.label);
        return res.status(200).json({ ok: true, data: row });
      }

      if (action === "addBooking") {
        const inserted = await sbFetch("bookings", {
          method: "POST",
          body: JSON.stringify(body.booking)
        });
        return res.status(200).json({ ok: true, data: Array.isArray(inserted) ? inserted[0] : inserted });
      }

      if (action === "updateBookingStatus") {
        await sbFetch(`bookings?id=eq.${encodeURIComponent(body.id)}`, {
          method: "PATCH",
          body: JSON.stringify({ status: body.status })
        });
        return res.status(200).json({ ok: true });
      }

      if (action === "deleteBooking") {
        await sbFetch(`bookings?id=eq.${encodeURIComponent(body.id)}`, {
          method: "DELETE",
          prefer: "return=minimal"
        });
        return res.status(200).json({ ok: true });
      }

      return res.status(400).json({ ok: false, error: "Unknown action" });
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message || String(error) });
  }
}
