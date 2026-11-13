import { useRef, useState } from 'react';
import { useProgress } from '../lib/store';

function Toggle({ on, onChange, label, desc }: { on: boolean; onChange: (v: boolean) => void; label: string; desc: string }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block font-semibold">{label}</span>
        <span className="block text-sm text-slate-500">{desc}</span>
      </span>
      <button
        role="switch"
        aria-checked={on}
        onClick={() => onChange(!on)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${on ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
      </button>
    </label>
  );
}

export function SettingsPage() {
  const { progress, updateSettings, reset, importSave } = useProgress();
  const file = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState('');

  const exportSave = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `learnplay-ai-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg('Progress exported ✓');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>

      <section className="card divide-y divide-slate-100 px-5 dark:divide-slate-800">
        <Toggle on={progress.settings.sound} onChange={(v) => updateSettings({ sound: v })} label="🔊 Sound effects" desc="Chimes for correct answers, XP and level-ups." />
        <Toggle
          on={progress.settings.explorer}
          onChange={(v) => updateSettings({ explorer: v })}
          label="🧭 Explorer mode"
          desc="Unlock every world and the final exam right away. Great if you already know the basics."
        />
        <div className="py-3">
          <div className="font-semibold">🎨 Theme</div>
          <div className="mt-2 flex gap-2">
            {(['light', 'dark', 'system'] as const).map((t) => (
              <button
                key={t}
                onClick={() => updateSettings({ theme: t })}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold capitalize ${progress.settings.theme === t ? 'bg-brand-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="card space-y-3 p-5">
        <h2 className="font-bold">💾 Your data</h2>
        <p className="text-sm text-slate-500">
          Progress is saved automatically in this browser — nothing is sent to a server. Export a backup to move it to another device.
        </p>
        <div className="flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={exportSave}>
            ⬇️ Export progress
          </button>
          <button className="btn-ghost" onClick={() => file.current?.click()}>
            ⬆️ Import progress
          </button>
          <input
            ref={file}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setMsg(importSave(await f.text()) ? 'Progress imported ✓' : 'That file could not be read.');
              e.target.value = '';
            }}
          />
          <button
            className="btn ml-auto border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:hover:bg-rose-950/40"
            onClick={() => {
              if (confirm('Reset ALL progress, XP and badges? This cannot be undone.')) {
                reset();
                setMsg('Progress reset.');
              }
            }}
          >
            Reset progress
          </button>
        </div>
        {msg && <p className="text-sm font-semibold text-brand-600">{msg}</p>}
      </section>
    </div>
  );
}
