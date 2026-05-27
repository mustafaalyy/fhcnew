const DATA_KEYS = {
  specialties: "app_specialties",
  doctors: "app_doctors",
  slides: "app_slides",
  aboutSections: "app_about_sections",
  settings: "app_settings",
  users: "app_users",
  prescriptions: "app_prescriptions",
  reports: "app_reports"
};

const LABELS = {
  [DATA_KEYS.specialties]: "بيانات التخصصات والعيادات",
  [DATA_KEYS.doctors]: "بيانات الأطباء",
  [DATA_KEYS.slides]: "سلايدر الصفحة الرئيسية",
  [DATA_KEYS.aboutSections]: "محتوى من نحن",
  [DATA_KEYS.settings]: "إعدادات الموقع",
  [DATA_KEYS.users]: "مستخدمي لوحة التحكم",
  [DATA_KEYS.prescriptions]: "روشتات المرضى",
  [DATA_KEYS.reports]: "تقارير المرضى"
};

const json = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
};

const readBody = async (req) => {
  let body = "";
  for await (const chunk of req) body += chunk;
  return body ? JSON.parse(body) : {};
};

const parseValue = (value) => {
  try {
    if (value === null || value === undefined || value === "") return null;
    return typeof value === "string" ? JSON.parse(value) : value;
  } catch {
    return value;
  }
};

const cleanBookingPayload = (booking = {}) => {
  const allowed = [
    "id",
    "patientName",
    "patient_name",
    "phone",
    "email",
    "age",
    "specialtyId",
    "specialty_id",
    "specialtyName",
    "specialty_name",
    "doctorId",
    "doctor_id",
    "doctorName",
    "doctor_name",
    "date",
    "time",
    "reason",
    "notes",
    "status",
    "created_at"
  ];

  const payload = {};
  for (const key of allowed) {
    if (booking[key] !== undefined) payload[key] = booking[key];
  }

  return {
    ...payload,
    patient_name: payload.patient_name || payload.patientName,
    specialty_id: payload.specialty_id || payload.specialtyId,
    specialty_name: payload.specialty_name || payload.specialtyName,
    doctor_id: payload.doctor_id || payload.doctorId,
    doctor_name: payload.doctor_name || payload.doctorName
  };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return json(res, 405, { ok: false, error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return json(res, 500, {
      ok: false,
      error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in Vercel Environment Variables"
    });
  }

  const sbFetch = async (path, options = {}) => {
    const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/${path}`, {
      ...options,
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: options.prefer || "return=representation",
        ...(options.headers || {})
      }
    });

    const text = await response.text();

    if (!response.ok) {
      throw new Error(text || `Supabase error ${response.status}`);
    }

    return text ? JSON.parse(text) : null;
  };

  const saveSiteValue = async (key, value, label) => {
    const payload = {
      key,
      value: JSON.stringify(value),
      type: "json",
      label: label || LABELS[key] || key,
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
  };

  try {
    const body = await readBody(req);
    const action = body.action;

    if (action === "load") {
      const keys = Object.values(DATA_KEYS);
      const encodedKeys = keys.map((key) => `"${key}"`).join(",");
      const siteRows = await sbFetch(
        `site_content?select=key,value,type,label,updated_at&key=in.(${encodedKeys})`
      ).catch(() => []);

      const collections = {};
      for (const row of Array.isArray(siteRows) ? siteRows : []) {
        collections[row.key] = parseValue(row.value);
      }

      if (!collections[DATA_KEYS.doctors]) {
        const doctors = await sbFetch("doctors?select=*&order=id.asc").catch(() => []);
        if (Array.isArray(doctors) && doctors.length > 0) {
          collections[DATA_KEYS.doctors] = doctors;
          await saveSiteValue(DATA_KEYS.doctors, doctors).catch(() => {});
        }
      }

      if (!collections[DATA_KEYS.users]) {
        const users = await sbFetch("admin_users?select=*&order=id.asc").catch(() => []);
        if (Array.isArray(users) && users.length > 0) {
          collections[DATA_KEYS.users] = users;
          await saveSiteValue(DATA_KEYS.users, users).catch(() => {});
        }
      }

      const bookings = await sbFetch("bookings?select=*&order=created_at.desc").catch(() => []);

      return json(res, 200, {
        ok: true,
        collections,
        bookings: Array.isArray(bookings) ? bookings : []
      });
    }

    if (action === "saveCollection") {
      const { key, value, label } = body;
      if (!key) return json(res, 400, { ok: false, error: "Missing collection key" });

      const saved = await saveSiteValue(key, value, label);
      return json(res, 200, { ok: true, saved });
    }

    if (action === "listBookings") {
      const bookings = await sbFetch("bookings?select=*&order=created_at.desc");
      return json(res, 200, { ok: true, bookings: Array.isArray(bookings) ? bookings : [] });
    }

    if (action === "addBooking") {
      const payload = cleanBookingPayload({
        ...body.booking,
        id: body.booking?.id || `FHH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        created_at: body.booking?.created_at || new Date().toISOString(),
        status: body.booking?.status || "pending"
      });

      const inserted = await sbFetch("bookings", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      return json(res, 200, {
        ok: true,
        booking: Array.isArray(inserted) ? inserted[0] : inserted
      });
    }

    if (action === "updateBookingStatus") {
      const { id, status } = body;
      if (!id) return json(res, 400, { ok: false, error: "Missing booking id" });

      const updated = await sbFetch(`bookings?id=eq.${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });

      return json(res, 200, {
        ok: true,
        booking: Array.isArray(updated) ? updated[0] : updated
      });
    }

    if (action === "deleteBooking") {
      const { id } = body;
      if (!id) return json(res, 400, { ok: false, error: "Missing booking id" });

      await sbFetch(`bookings?id=eq.${encodeURIComponent(id)}`, {
        method: "DELETE",
        prefer: "return=minimal"
      });

      return json(res, 200, { ok: true });
    }

    return json(res, 400, { ok: false, error: `Unknown action: ${action}` });
  } catch (error) {
    console.error("hospital-data API error:", error);
    return json(res, 500, { ok: false, error: error.message || "Internal server error" });
  }
}
