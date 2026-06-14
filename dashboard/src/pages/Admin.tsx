import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { getRecentUsers, getUsersStats, type RecentUser, type UsersStats } from "@/api/client";

type Range = 7 | 30 | 90;

export function Admin() {
  const [range, setRange] = useState<Range>(30);
  const [stats, setStats] = useState<UsersStats | null>(null);
  const [recent, setRecent] = useState<RecentUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.all([getUsersStats(range), getRecentUsers(10)])
      .then(([s, r]) => {
        if (cancelled) return;
        setStats(s);
        setRecent(r);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-soft text-primary">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-heading">
          Admin
        </h1>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}

      {loading && !stats ? (
        <div className="grid min-h-[40dvh] place-items-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : stats ? (
        <>
          {/* Stat cards */}
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={Users}
              label="Total users"
              value={stats.total_all_time}
              accent="ink"
            />
            <StatCard
              icon={TrendingUp}
              label={`Last ${stats.days} days`}
              value={stats.total_in_period}
              accent="primary"
            />
            <StatCard
              icon={TrendingUp}
              label="This week"
              value={stats.new_this_week}
              accent="primary"
            />
            <StatCard
              icon={TrendingUp}
              label="Today"
              value={stats.new_today}
              accent="primary"
            />
          </section>

          {/* Range selector */}
          <section className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-label">
              Registrations per day
            </h2>
            <div className="flex gap-1 rounded-input bg-card p-1">
              {([7, 30, 90] as Range[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`h-8 rounded-input px-3 text-xs font-semibold transition ${
                    range === r
                      ? "bg-surface text-ink-heading shadow-sm"
                      : "text-ink-muted hover:text-ink-heading"
                  }`}
                >
                  {r}d
                </button>
              ))}
            </div>
          </section>

          {/* Chart */}
          <section className="rounded-card bg-surface p-5 ring-1 ring-black/5 sm:p-6">
            <BarChart data={stats.data} />
          </section>

          {/* Recent users */}
          <section>
            <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-ink-label">
              Recent signups
            </h2>
            {recent.length === 0 ? (
              <p className="text-sm text-ink-muted">No signups yet.</p>
            ) : (
              <ul className="space-y-2">
                {recent.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between gap-3 rounded-card bg-surface p-3 ring-1 ring-black/5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink-heading">
                        {u.name ?? u.email.split("@")[0]}
                      </p>
                      <p className="truncate text-xs text-ink-muted">{u.email}</p>
                    </div>
                    <span className="shrink-0 text-xs text-ink-muted">
                      {formatRelative(u.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: number;
  accent: "ink" | "primary";
}) {
  const color = accent === "primary" ? "text-primary" : "text-ink-heading";
  return (
    <div className="rounded-card bg-card p-4">
      <div className="flex items-center gap-1.5 text-ink-label">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="text-[11px] font-semibold uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={`mt-2 text-2xl font-extrabold ${color}`}>
        {value.toLocaleString()}
      </p>
    </div>
  );
}

/**
 * Responsive bar chart using flex divs. Each bar's height is a % of max.
 * Tooltip on hover/focus shows date and count.
 */
function BarChart({
  data,
}: {
  data: Array<{ date: string; new_users: number }>;
}) {
  const max = Math.max(1, ...data.map((d) => d.new_users));
  const first = data[0]?.date;
  const mid = data[Math.floor(data.length / 2)]?.date;
  const last = data[data.length - 1]?.date;

  return (
    <div>
      <div className="flex h-48 items-end gap-[2px]">
        {data.map((d) => {
          const heightPct = Math.max((d.new_users / max) * 100, 2);
          return (
            <div
              key={d.date}
              tabIndex={0}
              role="img"
              aria-label={`${d.date}: ${d.new_users} new users`}
              title={`${formatDate(d.date)} · ${d.new_users} new`}
              className="group relative flex-1 rounded-t bg-primary-soft transition focus:outline-none"
            >
              <div
                className="absolute inset-x-0 bottom-0 rounded-t bg-primary transition group-hover:bg-primary-hover group-focus:bg-primary-hover"
                style={{ height: `${heightPct}%` }}
              />
              {d.new_users > 0 && (
                <span className="pointer-events-none absolute -top-7 left-1/2 hidden -translate-x-1/2 rounded-input bg-ink-heading px-1.5 py-0.5 text-[10px] font-bold text-white group-hover:block group-focus:block">
                  {d.new_users}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* X-axis ticks */}
      <div className="mt-2 flex justify-between text-[10px] font-semibold text-ink-muted">
        <span>{first && formatDate(first)}</span>
        {data.length > 4 && <span>{mid && formatDate(mid)}</span>}
        <span>{last && formatDate(last)}</span>
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.round((now - then) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}
