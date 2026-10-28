import type { A11ySettings, Language } from "@wordweave/bridge";

interface SettingsPanelProps {
  settings: A11ySettings;
  onChange: (settings: A11ySettings) => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function SettingsPanel({
  settings,
  onChange,
  language,
  onLanguageChange,
}: SettingsPanelProps) {
  return (
    <section className="settings" aria-labelledby="settings-title">
      <h2 id="settings-title">Reading settings</h2>
      <label className="field">
        <span>Language</span>
        <select
          value={language}
          onChange={(event) => onLanguageChange(event.target.value as Language)}
        >
          <option value="en">English</option>
          <option value="de">Deutsch</option>
        </select>
      </label>

      <label className="field check">
        <input
          type="checkbox"
          checked={settings.dyslexiaFont}
          onChange={(event) => onChange({ ...settings, dyslexiaFont: event.target.checked })}
        />
        <span>Easier-to-read font</span>
      </label>

      <label className="field">
        <span>Letter spacing</span>
        <input
          type="range"
          min="0"
          max="0.2"
          step="0.02"
          value={settings.letterSpacing}
          onChange={(event) => onChange({ ...settings, letterSpacing: Number(event.target.value) })}
        />
      </label>

      <label className="field">
        <span>Line height</span>
        <input
          type="range"
          min="1.4"
          max="2.2"
          step="0.1"
          value={settings.lineHeight}
          onChange={(event) => onChange({ ...settings, lineHeight: Number(event.target.value) })}
        />
      </label>

      <label className="field check">
        <input
          type="checkbox"
          checked={settings.reducedMotion}
          onChange={(event) => onChange({ ...settings, reducedMotion: event.target.checked })}
        />
        <span>Reduce motion</span>
      </label>
    </section>
  );
}
