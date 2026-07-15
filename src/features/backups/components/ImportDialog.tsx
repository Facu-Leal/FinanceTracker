import { useState } from 'react';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { commitImport, type ImportPreview } from '../logic/importData';
import { formatDateDisplay } from '../../../shared/utils/dateUtils';

const LABELS: Record<string, string> = {
  accounts: 'Cuentas',
  categories: 'Categorías',
  transactions: 'Movimientos',
  fixedExpenses: 'Gastos fijos',
  fixedExpenseOccurrences: 'Ocurrencias de gastos fijos',
  installmentPurchases: 'Compras en cuotas',
  installments: 'Cuotas',
  budgets: 'Presupuestos',
};

interface ImportDialogProps {
  preview: ImportPreview | null;
  onClose: () => void;
  onImported: () => void;
}

export function ImportDialog({ preview, onClose, onImported }: ImportDialogProps) {
  const [submitting, setSubmitting] = useState(false);

  if (!preview) return null;

  return (
    <BottomSheet open={Boolean(preview)} onClose={onClose} title="Confirmar restauración">
      <p className="small text-secondary">
        Respaldo del {formatDateDisplay(preview.exportedAt.slice(0, 10))}. Esto va a{' '}
        <strong>reemplazar todos los datos actuales</strong> del dispositivo por los de este archivo.
      </p>

      <div className="list-group list-group-flush mb-3">
        {Object.entries(preview.counts).map(([key, count]) => (
          <div key={key} className="list-group-item d-flex justify-content-between px-0">
            <span>{LABELS[key] ?? key}</span>
            <span className="fw-medium">{count}</span>
          </div>
        ))}
      </div>

      <p className="small text-secondary">
        Antes de restaurar, se descarga automáticamente un respaldo de tus datos actuales por si necesitás volver atrás.
      </p>

      <button
        type="button"
        className="btn btn-danger w-100"
        disabled={submitting}
        onClick={async () => {
          setSubmitting(true);
          await commitImport(preview.data);
          setSubmitting(false);
          onImported();
        }}
      >
        Restaurar y reemplazar mis datos
      </button>
    </BottomSheet>
  );
}
