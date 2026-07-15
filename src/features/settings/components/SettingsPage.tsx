import { useState } from 'react';
import { getStoredTheme, setStoredTheme, type ThemePreference } from '../../../shared/theme';
import { resetAllData } from '../../../db/reset';
import { ConfirmDialog } from '../../../shared/ui/ConfirmDialog';

const THEME_OPTIONS: Array<{ value: ThemePreference; label: string; icon: string }> = [
  { value: 'system', label: 'Sistema', icon: 'bi-circle-half' },
  { value: 'light', label: 'Claro', icon: 'bi-sun' },
  { value: 'dark', label: 'Oscuro', icon: 'bi-moon-stars' },
];

export function SettingsPage() {
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  return (
    <div>
      <h1 className="h4 mb-3">Configuración</h1>

      <div className="card mb-3">
        <div className="card-body">
          <div className="fw-medium mb-2">Apariencia</div>
          <div className="d-flex gap-2">
            {THEME_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`btn flex-fill d-flex flex-column align-items-center gap-1 py-2 ${
                  theme === option.value ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => {
                  setTheme(option.value);
                  setStoredTheme(option.value);
                }}
              >
                <i className={`bi ${option.icon}`} />
                <span className="small">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-3 border-danger-subtle">
        <div className="card-body">
          <div className="fw-medium mb-2 text-danger">
            <i className="bi bi-exclamation-triangle me-1" />
            Zona de peligro
          </div>
          <p className="small text-secondary">
            Borra todas tus cuentas, categorías, movimientos, presupuestos, gastos fijos y cuotas, y deja la
            app como recién instalada. Antes de borrar nada, se descarga automáticamente un respaldo por las
            dudas.
          </p>
          <button type="button" className="btn btn-outline-danger w-100" onClick={() => setConfirmOpen(true)}>
            Reiniciar aplicación
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body small text-secondary">
          <div className="mb-1">Finance Tracker — versión 0.1.0. Toda tu información se guarda únicamente en este dispositivo.</div>
          <div>© {new Date().getFullYear()} Pikka. Todos los derechos reservados.</div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="¿Reiniciar la aplicación?"
        description="Esto borra permanentemente todos tus datos de este dispositivo. Se descarga un respaldo automático antes de borrar, por si necesitás recuperarlos."
        confirmLabel={resetting ? 'Reiniciando...' : 'Sí, borrar todo'}
        danger
        onCancel={() => setConfirmOpen(false)}
        onConfirm={async () => {
          setResetting(true);
          await resetAllData();
          window.location.reload();
        }}
      />
    </div>
  );
}
