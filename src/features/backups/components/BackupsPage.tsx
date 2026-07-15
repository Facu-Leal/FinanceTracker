import { useRef, useState } from 'react';
import { downloadBackup, getLastBackupAt } from '../logic/exportData';
import { parseBackupFile, ImportError, type ImportPreview } from '../logic/importData';
import { ImportDialog } from './ImportDialog';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';

export function BackupsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [lastBackupAt, setLastBackupAt] = useState(getLastBackupAt());
  const [exporting, setExporting] = useState(false);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setExporting(true);
    await downloadBackup();
    setLastBackupAt(getLastBackupAt());
    setExporting(false);
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setError(null);
    try {
      const text = await file.text();
      setPreview(parseBackupFile(text));
    } catch (err) {
      setError(err instanceof ImportError ? err.message : 'No se pudo leer el archivo.');
    }
  }

  return (
    <div>
      <h1 className="h4 mb-3">Respaldos</h1>

      <div className="card mb-3">
        <div className="card-body">
          <div className="small text-secondary mb-3">
            {lastBackupAt ? `Último respaldo: ${formatDateDisplay(lastBackupAt.slice(0, 10))}` : 'Todavía no hiciste ningún respaldo.'}
          </div>

          <button type="button" className="btn btn-primary w-100 mb-2" disabled={exporting} onClick={handleExport}>
            <i className="bi bi-cloud-arrow-down me-1" />
            Exportar ahora
          </button>

          <button type="button" className="btn btn-outline-secondary w-100" onClick={() => fileInputRef.current?.click()}>
            <i className="bi bi-cloud-arrow-up me-1" />
            Importar / Restaurar
          </button>
          <input ref={fileInputRef} type="file" accept="application/json" className="d-none" onChange={handleFileSelected} />

          {error && <p className="small text-danger mt-2 mb-0">{error}</p>}
        </div>
      </div>

      <div className="card">
        <div className="card-body small text-secondary">
          <i className="bi bi-info-circle me-1" />
          Tus datos viven solo en este dispositivo/navegador. Un respaldo es la única forma de moverlos a otro
          dispositivo o recuperarlos si se borra el almacenamiento del navegador.
        </div>
      </div>

      <ImportDialog
        preview={preview}
        onClose={() => setPreview(null)}
        onImported={() => {
          setPreview(null);
          window.location.reload();
        }}
      />
    </div>
  );
}
