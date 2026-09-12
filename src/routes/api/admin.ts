import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const usernameSchema = z
  .string()
  .trim()
  .min(3)
  .max(40)
  .regex(/^[a-z0-9._-]+$/i, "Username hanya boleh huruf, angka, titik, dan garis");

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("list_users") }),
  z.object({
    action: z.literal("create_staff"),
    username: usernameSchema,
    password: z.string().min(6).max(72),
    full_name: z.string().trim().max(120).optional(),
    phone: z.string().trim().max(30).optional(),
    role: z.enum(["health_worker", "super_admin"]).default("health_worker"),
  }),
  z.object({
    action: z.literal("set_role"),
    user_id: z.string().uuid(),
    role: z.enum(["health_worker", "super_admin", "parent"]),
  }),
  z.object({
    action: z.literal("set_active"),
    user_id: z.string().uuid(),
    is_active: z.boolean(),
  }),
  z.object({
    action: z.literal("reset_password"),
    user_id: z.string().uuid(),
    password: z.string().min(6).max(72),
  }),
  z.object({ action: z.literal("delete_user"), user_id: z.string().uuid() }),
]);

const EMAIL_DOMAIN = "glucogrow.local";
const json = (data: unknown, status = 200) => Response.json(data, { status });

export const Route = createFileRoute("/api/admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = process.env["SUPABASE_URL"];
        const publishable = process.env["SUPABASE_PUBLISHABLE_KEY"];
        if (!url || !publishable) return json({ error: "Backend belum siap" }, 500);

        const token = request.headers.get("authorization")?.replace(/^Bearer /i, "");
        if (!token) return json({ error: "Tidak memiliki akses" }, 401);

        const asUser = createClient(url, publishable, {
          auth: { persistSession: false, autoRefreshToken: false },
          global: { headers: { Authorization: `Bearer ${token}` } },
        });

        const { data: userData, error: userErr } = await asUser.auth.getUser(token);
        if (userErr || !userData.user) return json({ error: "Sesi tidak valid" }, 401);

        const { data: isSuper } = await asUser.rpc("has_role", {
          _user_id: userData.user.id,
          _role: "super_admin",
        });
        if (!isSuper) return json({ error: "Hanya Super Admin yang diizinkan" }, 403);

        let body: z.infer<typeof bodySchema>;
        try {
          body = bodySchema.parse(await request.json());
        } catch {
          return json({ error: "Data permintaan tidak valid" }, 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        if (body.action === "list_users") {
          const { data: profiles, error } = await supabaseAdmin
            .from("profiles")
            .select("id, username, full_name, phone, is_active, created_at")
            .order("created_at", { ascending: false });
          if (error) return json({ error: error.message }, 500);
          const { data: roles } = await supabaseAdmin.from("user_roles").select("user_id, role");
          return json({
            users: (profiles ?? []).map((p) => ({
              ...p,
              role: roles?.find((r) => r.user_id === p.id)?.role ?? "parent",
            })),
          });
        }

        if (body.action === "create_staff") {
          const email = `${body.username.toLowerCase()}@${EMAIL_DOMAIN}`;
          const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: body.password,
            email_confirm: true,
            user_metadata: {
              username: body.username.toLowerCase(),
              full_name: body.full_name ?? null,
              phone: body.phone ?? null,
            },
          });
          if (error || !created.user) {
            return json({ error: error?.message ?? "Gagal membuat akun" }, 400);
          }
          await supabaseAdmin.from("user_roles").delete().eq("user_id", created.user.id);
          const { error: roleErr } = await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: created.user.id, role: body.role });
          if (roleErr) return json({ error: roleErr.message }, 400);
          return json({ ok: true, user_id: created.user.id });
        }

        if (body.action === "set_role") {
          if (body.user_id === userData.user.id) {
            return json({ error: "Tidak dapat mengubah peran akun sendiri" }, 400);
          }
          await supabaseAdmin.from("user_roles").delete().eq("user_id", body.user_id);
          const { error } = await supabaseAdmin
            .from("user_roles")
            .insert({ user_id: body.user_id, role: body.role });
          if (error) return json({ error: error.message }, 400);
          return json({ ok: true });
        }

        if (body.action === "set_active") {
          if (body.user_id === userData.user.id) {
            return json({ error: "Tidak dapat menonaktifkan akun sendiri" }, 400);
          }
          const { error } = await supabaseAdmin
            .from("profiles")
            .update({ is_active: body.is_active })
            .eq("id", body.user_id);
          if (error) return json({ error: error.message }, 400);
          await supabaseAdmin.auth.admin.updateUserById(body.user_id, {
            ban_duration: body.is_active ? "none" : "876000h",
          });
          return json({ ok: true });
        }

        if (body.action === "reset_password") {
          const { error } = await supabaseAdmin.auth.admin.updateUserById(body.user_id, {
            password: body.password,
          });
          if (error) return json({ error: error.message }, 400);
          return json({ ok: true });
        }

        if (body.action === "delete_user") {
          if (body.user_id === userData.user.id) {
            return json({ error: "Tidak dapat menghapus akun sendiri" }, 400);
          }
          const { error } = await supabaseAdmin.auth.admin.deleteUser(body.user_id);
          if (error) return json({ error: error.message }, 400);
          return json({ ok: true });
        }

        return json({ error: "Aksi tidak dikenal" }, 400);
      },
    },
  },
});
