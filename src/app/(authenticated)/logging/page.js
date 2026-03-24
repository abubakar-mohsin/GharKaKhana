'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, AlertTriangle, X } from 'lucide-react';

const RANGE_OPTIONS = [
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
];

const MEAL_TIME_LABELS = {
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
};

async function fetchMealLogs(range) {
  const response = await fetch(`/api/meal-logs?range=${range}`);
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Failed to fetch meal logs');
  return payload.data ?? [];
}

async function deleteMealLog(id) {
  const response = await fetch(`/api/meal-logs/${id}`, { method: 'DELETE' });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Failed to delete meal log');
  return payload;
}

async function updateMealLog({ id, servings, notes }) {
  const response = await fetch(`/api/meal-logs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ servings, notes: notes.trim() || null }),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || 'Failed to update meal log');
  return payload.data;
}

function formatLogDate(logDate) {
  if (!logDate) return '';
  const datePart = String(logDate).slice(0, 10);
  const [year, month, day] = datePart.split('-').map(Number);
  const safeLocalDate = new Date(year, (month || 1) - 1, day || 1, 12);
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(safeLocalDate);
}

function formatServings(value) {
  return `${Number(value).toFixed(1).replace(/\.0$/, '')} servings`;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div key={item} className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="mb-4 h-5 w-40 rounded bg-stone-200" />
          <div className="mb-3 h-4 w-28 rounded bg-stone-100" />
          <div className="mb-2 h-4 w-32 rounded bg-stone-100" />
          <div className="h-10 w-full rounded bg-stone-100" />
        </div>
      ))}
    </div>
  );
}

function EditMealLogForm({ log, onCancel, onSave, isSaving }) {
  const [servings, setServings] = useState(log.servings ?? 1);
  const [notes, setNotes] = useState(log.notes ?? '');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({ id: log.id, servings: Number(servings), notes });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-2xl bg-[#F7F4EF] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[#57534E]">Servings</span>
          <input
            type="number"
            min="0.5"
            max="10"
            step="0.5"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
            className="h-11 w-full rounded-xl border border-[#D6D3D1] bg-white px-3 text-sm text-[#1C1917] outline-none focus:border-[#7C3AED]"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-[#57534E]">Notes</span>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional note"
            className="h-11 w-full rounded-xl border border-[#D6D3D1] bg-white px-3 text-sm text-[#1C1917] outline-none focus:border-[#7C3AED]"
          />
        </label>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#D6D3D1] bg-white px-4 py-2 text-sm font-semibold text-[#44403C]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
          style={{ backgroundColor: '#7C3AED' }}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}

// ─── Inline delete confirmation ────────────────────────────────────────────────
// Replaces the trash icon with a compact, animated confirm strip.
// No browser dialogs. No round-trips. Pure inline state.
function DeleteConfirmRow({ onConfirm, onCancel, isPending }) {
  return (
    <div
      className="flex items-center gap-2"
      style={{
        animation: 'slideInConfirm 0.2s cubic-bezier(0.34,1.3,0.64,1) both',
      }}
    >
      {/* Subtle warning icon — communicates intent without aggression */}
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-red-50">
        <AlertTriangle size={14} className="text-red-500" />
      </span>

      <span className="whitespace-nowrap text-xs font-medium text-[#78716C]">
        Remove this entry?
      </span>

      {/* Confirm — red, decisive */}
      <button
        type="button"
        onClick={onConfirm}
        disabled={isPending}
        className="h-8 rounded-xl bg-red-600 px-3 text-xs font-semibold text-white transition-all
                   hover:bg-red-700 active:scale-95 disabled:opacity-60"
      >
        {isPending ? 'Deleting…' : 'Delete'}
      </button>

      {/* Cancel — neutral, low weight */}
      <button
        type="button"
        onClick={onCancel}
        disabled={isPending}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#E7E5E4]
                   bg-white text-[#78716C] transition-all hover:bg-[#F7F4EF] active:scale-95
                   disabled:opacity-60"
        aria-label="Cancel delete"
      >
        <X size={13} />
      </button>

      <style>{`
        @keyframes slideInConfirm {
          from { opacity: 0; transform: translateX(8px) scale(0.96); }
          to   { opacity: 1; transform: translateX(0)   scale(1);    }
        }
      `}</style>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LoggingPage() {
  const queryClient = useQueryClient();
  const [range, setRange] = useState('week');
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // ← tracks which row is in confirm state
  const [actionError, setActionError] = useState('');

  const queryKey = useMemo(() => ['meal-logs', range], [range]);

  const { data: logs = [], isLoading, isFetching, error } = useQuery({
    queryKey,
    queryFn: () => fetchMealLogs(range),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMealLog,
    onSuccess: async () => {
      setActionError('');
      setDeletingId(null);
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (mutationError) => {
      setActionError(mutationError.message);
      setDeletingId(null);
    },
  });

  const editMutation = useMutation({
    mutationFn: updateMealLog,
    onSuccess: async () => {
      setEditingId(null);
      setActionError('');
      await queryClient.invalidateQueries({ queryKey });
    },
    onError: (mutationError) => {
      setActionError(mutationError.message);
    },
  });

  // No confirm() — just arm the row. The user then decides inside the UI.
  const handleDeleteRequest = (id) => {
    setActionError('');
    setDeletingId(id);
  };

  const handleDeleteConfirm = (id) => {
    deleteMutation.mutate(id);
  };

  const handleDeleteCancel = () => {
    setDeletingId(null);
  };

  return (
    <section className="-mx-4 min-h-[calc(100vh-96px)] bg-[#F7F4EF] px-4 py-8 sm:mx-0 sm:rounded-[32px] sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#A8A29E]">
              Meal History
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#1C1917]">Logged Meals</h1>
            <p className="mt-2 text-sm text-[#78716C]">
              Review recent meals, update servings, and remove anything logged by mistake.
            </p>
          </div>

          <div className="inline-flex rounded-2xl bg-white p-1 shadow-sm">
            {RANGE_OPTIONS.map((option) => {
              const selected = option.value === range;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRange(option.value)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    selected ? 'text-white' : 'text-[#57534E]'
                  }`}
                  style={selected ? { backgroundColor: '#7C3AED' } : undefined}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {actionError ? (
          <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {actionError}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-base font-semibold text-[#1C1917]">Unable to load meal logs</p>
            <p className="mt-2 text-sm text-[#78716C]">{error.message}</p>
          </div>
        ) : isLoading ? (
          <LoadingSkeleton />
        ) : logs.length === 0 ? (
          <div className="rounded-[28px] bg-white px-6 py-12 text-center shadow-sm">
            <div className="text-5xl">🍽️</div>
            <h2 className="mt-4 text-2xl font-bold text-[#1C1917]">No meals logged yet</h2>
            <p className="mt-2 text-sm text-[#78716C]">
              Start with a dish you already know or browse the menu for ideas.
            </p>
            <Link
              href="/dishes"
              className="mt-6 inline-flex rounded-2xl px-5 py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: '#7C3AED' }}
            >
              Browse dishes
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => {
              const dishName = log.dishId ? log.dish?.name : log.customMealName;
              const isEditing  = editingId  === log.id;
              const isDeleting = deletingId === log.id;

              return (
                <article
                  key={log.id}
                  className="rounded-[28px] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-[#1C1917]">{dishName}</h2>
                        <span className="rounded-full bg-[#EDE9FE] px-3 py-1 text-xs font-semibold text-[#7C3AED]">
                          {MEAL_TIME_LABELS[log.mealTime] || log.mealTime}
                        </span>
                        {!log.dishId ? (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            Custom Meal
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-sm text-[#78716C]">{formatLogDate(log.logDate)}</p>
                      <p className="mt-1 text-sm font-medium text-[#44403C]">
                        {formatServings(log.servings)}
                      </p>

                      {!log.dishId ? (
                        <p className="mt-2 text-sm text-orange-700">No nutrition data available</p>
                      ) : null}

                      {log.notes ? (
                        <p className="mt-3 rounded-2xl bg-[#F7F4EF] px-4 py-3 text-sm text-[#57534E]">
                          {log.notes}
                        </p>
                      ) : null}
                    </div>

                    {/* ── Action area ───────────────────────────────────────────
                        Three possible states for this slot:
                        1. Normal   → edit icon + trash icon
                        2. Deleting → animated inline confirm strip
                        3. Pending  → confirm strip with spinner, buttons disabled
                    ─────────────────────────────────────────────────────────── */}
                    <div className="flex shrink-0 items-center gap-2">
                      {isDeleting ? (
                        // ── State 2 & 3: inline confirm, replaces both icon buttons ──
                        <DeleteConfirmRow
                          onConfirm={() => handleDeleteConfirm(log.id)}
                          onCancel={handleDeleteCancel}
                          isPending={deleteMutation.isPending}
                        />
                      ) : (
                        // ── State 1: normal edit + delete icons ──
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setActionError('');
                              setEditingId(isEditing ? null : log.id);
                            }}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border
                                       border-[#DDD6FE] bg-[#F5F3FF] text-[#7C3AED] transition-all
                                       hover:bg-[#EDE9FE] active:scale-95"
                            aria-label="Edit meal log"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteRequest(log.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border
                                       border-red-100 bg-red-50 text-red-500 transition-all
                                       hover:border-red-200 hover:bg-red-100 hover:text-red-600
                                       active:scale-95"
                            aria-label="Delete meal log"
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {isEditing ? (
                    <EditMealLogForm
                      log={log}
                      onCancel={() => setEditingId(null)}
                      onSave={(values) => editMutation.mutate(values)}
                      isSaving={editMutation.isPending}
                    />
                  ) : null}
                </article>
              );
            })}
          </div>
        )}

        {isFetching && !isLoading ? (
          <p className="mt-4 text-sm text-[#78716C]">Refreshing meal logs...</p>
        ) : null}
      </div>
    </section>
  );
}