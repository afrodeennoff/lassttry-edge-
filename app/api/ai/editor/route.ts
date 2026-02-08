import { NextRequest } from "next/server";
import { z } from "zod";
import { sanitizeText } from "@/lib/security";
import { ok, fail, safeJson } from "@/lib/http";

const schema = z.object({
  text: z.string().min(1),
  tone: z.enum(["concise", "reflective", "structured"]).default("structured")
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await safeJson<unknown>(req));
  if (!parsed.success) return fail("invalid payload", 400);

  const clean = sanitizeText(parsed.data.text);
  const improved =
    parsed.data.tone === "concise"
      ? clean
          .split(/\n+/)
          .map((s) => s.trim())
          .filter(Boolean)
          .slice(0, 5)
          .join(". ")
      : parsed.data.tone === "reflective"
      ? `Observation: ${clean}\n\nLesson: Identify repeatable setup triggers and emotional cues.\n\nNext Action: Define one measurable adjustment for tomorrow.`
      : `Summary\n${clean}\n\nWhat Went Well\n- Entries aligned with setup\n\nWhat To Improve\n- Risk consistency\n\nPlan\n- Keep max risk fixed per trade`;

  return ok({ improved });
}
