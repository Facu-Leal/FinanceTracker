import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * With registerType: 'prompt' (vite.config.ts), a new deploy's service worker downloads and
 * waits in the background — it never activates on its own, so the installed app would keep
 * showing the old version until this prompt explicitly hands it control. Deliberately not
 * auto-reloading: doing that mid-edit (e.g. while filling out a transaction) would be jarring.
 */
export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="p-3 card shadow-sm">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-arrow-repeat fs-5 text-primary" />
        <div className="flex-fill small">Hay una nueva versión disponible.</div>
        <button type="button" className="btn btn-sm btn-primary" onClick={() => updateServiceWorker(true)}>
          Actualizar
        </button>
        <button type="button" className="btn-close" aria-label="Cerrar" onClick={() => setNeedRefresh(false)} />
      </div>
    </div>
  );
}
