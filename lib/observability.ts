export type LogLevel = "info" | "warn" | "error";

export function log(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    ts: new Date().toISOString(),
    context: context ?? {}
  };
  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }
  console.log(JSON.stringify(payload));
}

export function metric(name: string, value: number, tags?: Record<string, string>) {
  console.log(JSON.stringify({ metric: name, value, tags: tags ?? {}, ts: new Date().toISOString() }));
}
