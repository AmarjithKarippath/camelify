import { useEffect, useState } from "react";
import {
  Bug,
  Loader2,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getAdminFeedback,
  getRecentUsers,
  getUsersStats,
  updateFeedbackStatus,
  type AdminFeedbackItem,
  type AdminFeedbackResponse,
  type FeedbackKind,
  type FeedbackStatus,
  type RecentUser,
  type UsersStats,
} from "@/api/client";

type Tab = "users" | "feedback";
type Range = 7 | 30 | 90;

export function Admin() {
  const [tab, setTab] = useState<Tab>("users");
  const [feedbackBadge, setFeedbackBadge] = useState<number | null>(null);

  // Pre-fetch the count for the tab badge.
  useEffect(() => {
    getAdminFeedback("new")
      .then((d) => setFeedbackBadge(d.counts.new))
      .catch(() => setFeedbackBadge(null));
  }, []);

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

      {/* Tabs */}
      <div className="flex gap-1 rounded-input bg-card p-1">
        <TabButton
          active={tab === "users"}
          onClick={() => setTab("users")}
          label="User stats"
        />
        <TabButton
          active={tab === "feedback"}
          onClick={() => setTab("feedback")}
          label="Feedback"
          badge={feedbackBadge ?? undefined}
        />
      </div>

      {tab === "users" ? <UsersStatsView /> : <FeedbackView onCountChange={setFeedbackBadge} />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex h-10 flex-1 items-center justify-center gap-2 rounded-input px-3 text-sm font-semibold transition ${
        active
          ? "bg-surface text-ink-heading shadow-sm"
          : "text-ink-muted hover:text-ink-heading"
      }`}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-white">
          {badge}
        </span>
      )}
    </button>
  );
}

/* ---------- User Stats View ---------- */

function UsersStatsView() {
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

  if (loading && !stats) {
    return (
      <div className="grid min-h-[40dvh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p
        role="alert"
        className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
      >
        {error}
      </p>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={Users} label="Total users" value={stats.total_all_time} accent="ink" />
        <StatCard
          icon={TrendingUp}
          label={`Last ${stats.days} days`}
          value={stats.total_in_period}
          accent="primary"
        />
        <StatCard icon={TrendingUp} label="This week" value={stats.new_this_week} accent="primary" />
        <StatCard icon={TrendingUp} label="Today" value={stats.new_today} accent="primary" />
      </section>

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

      <section className="rounded-card bg-surface p-5 ring-1 ring-black/5 sm:p-6">
        <BarChart data={stats.data} />
      </section>

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
        <span className="text-[11px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
      <p className={`mt-2 text-2xl font-extrabold ${color}`}>{value.toLocaleString()}</p>
    </div>
  );
}

function BarChart({ data }: { data: Array<{ date: string; new_users: number }> }) {
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

      <div className="mt-2 flex justify-between text-[10px] font-semibold text-ink-muted">
        <span>{first && formatDate(first)}</span>
        {data.length > 4 && <span>{mid && formatDate(mid)}</span>}
        <span>{last && formatDate(last)}</span>
      </div>
    </div>
  );
}

/* ---------- Feedback View ---------- */

const STATUS_FILTERS: Array<{ id: FeedbackStatus | "all"; label: string }> = [
  { id: "all", label: "All" },
  { id: "new", label: "New" },
  { id: "in_review", label: "In review" },
  { id: "closed", label: "Closed" },
];

function FeedbackView({
  onCountChange,
}: {
  onCountChange: (newCount: number) => void;
}) {
  const [filter, setFilter] = useState<FeedbackStatus | "all">("all");
  const [data, setData] = useState<AdminFeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAdminFeedback(filter === "all" ? undefined : filter);
      setData(res);
      onCountChange(res.counts.new);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleStatusChange(item: AdminFeedbackItem, next: FeedbackStatus) {
    if (item.status === next) return;
    setPendingId(item.id);
    try {
      await updateFeedbackStatus(item.id, next);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setPendingId(null);
    }
  }

  if (loading && !data) {
    return (
      <div className="grid min-h-[40dvh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Counts */}
      {data && (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={MessageSquare} label="Total" value={data.counts.total} accent="ink" />
          <StatCard icon={MessageSquare} label="New" value={data.counts.new} accent="primary" />
          <StatCard icon={MessageSquare} label="In review" value={data.counts.in_review} accent="ink" />
          <StatCard icon={MessageSquare} label="Closed" value={data.counts.closed} accent="ink" />
        </section>
      )}

      {/* Status filter */}
      <section className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setFilter(s.id)}
            className={`h-8 rounded-full px-3 text-xs font-semibold transition ${
              filter === s.id
                ? "bg-ink-heading text-white"
                : "bg-card text-ink-body hover:bg-card/70"
            }`}
          >
            {s.label}
          </button>
        ))}
      </section>

      {error && (
        <p
          role="alert"
          className="rounded-input border border-danger/30 bg-danger/5 px-3 py-2 text-sm font-medium text-danger"
        >
          {error}
        </p>
      )}

      {/* Items */}
      {data?.items.length === 0 ? (
        <p className="text-sm text-ink-muted">No feedback in this view.</p>
      ) : (
        <ul className="space-y-3">
          {data?.items.map((item) => (
            <FeedbackRow
              key={item.id}
              item={item}
              pending={pendingId === item.id}
              onStatusChange={(s) => handleStatusChange(item, s)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function FeedbackRow({
  item,
  pending,
  onStatusChange,
}: {
  item: AdminFeedbackItem;
  pending: boolean;
  onStatusChange: (next: FeedbackStatus) => void;
}) {
  return (
    <li className="rounded-card bg-surface p-4 ring-1 ring-black/5">
      <div className="flex items-start gap-3">
        <KindBadge kind={item.kind} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate text-sm font-bold text-ink-heading">
              {item.user_name ?? item.user_email.split("@")[0]}
            </span>
            <span className="truncate text-xs text-ink-muted">{item.user_email}</span>
            <span className="text-xs text-ink-muted">·</span>
            <span className="text-xs text-ink-muted">{formatRelative(item.created_at)}</span>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm text-ink-body">{item.message}</p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <StatusPill status={item.status} />
            <div className="ml-auto flex gap-1">
              {item.status !== "new" && (
                <ActionButton
                  label="Mark new"
                  disabled={pending}
                  onClick={() => onStatusChange("new")}
                />
              )}
              {item.status !== "in_review" && (
                <ActionButton
                  label="In review"
                  disabled={pending}
                  onClick={() => onStatusChange("in_review")}
                />
              )}
              {item.status !== "closed" && (
                <ActionButton
                  label="Close"
                  disabled={pending}
                  onClick={() => onStatusChange("closed")}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function KindBadge({ kind }: { kind: FeedbackKind }) {
  const Icon = kind === "bug" ? Bug : kind === "feature" ? Sparkles : MessageSquare;
  const bg =
    kind === "bug"
      ? "bg-danger/10 text-danger"
      : kind === "feature"
        ? "bg-primary-soft text-primary"
        : "bg-card text-ink-label";
  return (
    <span
      aria-hidden="true"
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${bg}`}
    >
      <Icon className="h-4 w-4" />
    </span>
  );
}

function StatusPill({ status }: { status: FeedbackStatus }) {
  const map = {
    new: { label: "New", cls: "bg-primary text-white" },
    in_review: { label: "In review", cls: "bg-warn/20 text-warn" },
    closed: { label: "Closed", cls: "bg-card text-ink-muted" },
  };
  const v = map[status];
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${v.cls}`}>
      {v.label}
    </span>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="h-8 rounded-input border border-black/10 bg-surface px-2.5 text-xs font-semibold text-ink-heading hover:bg-card disabled:opacity-60"
    >
      {label}
    </button>
  );
}

/* ---------- Helpers ---------- */

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
