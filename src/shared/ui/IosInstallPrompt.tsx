import { useEffect, useState } from 'react';

const DISMISSED_KEY = 'financeTracker.iosInstallDismissed';

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** iOS Safari has no beforeinstallprompt — this is the only way to nudge toward "Agregar a inicio". */
export function IosInstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isIos() && !isStandalone() && !localStorage.getItem(DISMISSED_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  }

  return (
    <div className="p-3 card shadow-sm">
      <div className="d-flex align-items-start gap-2">
        <i className="bi bi-phone fs-5 text-primary" />
        <div className="flex-fill small">
          Instalá Finance Tracker: tocá <i className="bi bi-box-arrow-up" /> Compartir y luego{' '}
          <strong>&quot;Agregar a inicio&quot;</strong>.
        </div>
        <button type="button" className="btn-close" aria-label="Cerrar" onClick={dismiss} />
      </div>
    </div>
  );
}
