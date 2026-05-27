const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const TABLES = {
  doctors: "doctors",
  slides: "slides",
  aboutSections: "about_sections",
  settings: "site_settings",
  bookings: "bookings",
  users: "admin_users",
  prescriptions: "prescriptions",
  reports: "reports"
};

const tableColumns = {
  doctors: ["id", "name", "specialtyId", "specialty", "title", "experience", "image", "phone", "available", "rating", "bio", "schedule"],
  slides: ["id", "title", "subtitle", "image", "buttonText", "buttonLink", "active"],
  aboutSections: ["id", "title", "content", "image", "active"],
  site_settings: ["id", "hospitalName", "hospitalNameAr", "logo", "phone", "whatsapp", "email", "address", "googleMapsUrl", "facebook", "instagram", "workingHours"],
  bookings: ["id", "patientName", "phone", "age", "gender", "specialtyId", "specialtyName", "doctorId", "doctorName", "date", "time", "status", "notes", "createdAt"],
  admin_users: ["id", "username", "password", "name", "role", "active"],
  prescriptions: ["id", "bookingId", "patientName", "doctorName", "medicines", "notes", "createdAt"],
  reports: ["id", "title", "type", "data", "createdAt"]
};

function normalizeItem(table, item) {
  if (!item || typeof item !== "object") return item;
  const allowed = tableColumns[table];
  if (!allowed) return item;
  const out = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(item, key)) out[key] = item[key];
  }
  return out;
}

async function supabase(path, options = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables");
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

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function readTable(table) {
  return await supabase(`${table}?select=*`, { method: "GET" });
}

async function replaceTable(table, items) {
  const normalized = Array.isArray(items) ? items.map((item) => normalizeItem(table, item)) : [];
  await supabase(table, { method: "DELETE", headers: { Prefer: "return=minimal" } });
  if (!normalized.length) return [];
  return await supabase(table, {
    method: "POST",
    body: JSON.stringify(normalized),
    prefer: "resolution=merge-duplicates,return=representation"
  });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");

  try {
    if (req.method === "GET") {
      const payload = {};
      for (const [key, table] of Object.entries(TABLES)) {
        try {
          payload[key] = await readTable(table);
        } catch (error) {
          payload[key] = [];
          payload[`${key}Error`] = error.message;
        }
      }
      return res.status(200).json({ ok: true, data: payload });
    }

    if (req.method === "PUT" || req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const key = body.key;
      const items = body.items;

      if (!key || !TABLES[key]) {
        return res.status(400).json({ ok: false, error: `Unknown data key: ${key}` });
      }

      if (!Array.isArray(items)) {
        return res.status(400).json({ ok: false, error: "items must be an array" });
      }

      const saved = await replaceTable(TABLES[key], items);
      return res.status(200).json({ ok: true, key, count: saved?.length || 0, data: saved || [] });
    }

    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
