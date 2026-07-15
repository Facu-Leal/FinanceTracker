import { useState } from 'react';
import { useInstallmentPurchases } from '../hooks/useInstallmentPurchases';
import { BottomSheet } from '../../../shared/ui/BottomSheet';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { NewPurchaseForm } from './NewPurchaseForm';
import { InstallmentPurchaseCard } from './InstallmentPurchaseCard';

export function InstallmentPurchasesPage() {
  const purchases = useInstallmentPurchases();
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h4 mb-0">Tarjetas y Cuotas</h1>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => setFormOpen(true)}>
          <i className="bi bi-plus-lg" /> Nueva
        </button>
      </div>

      {purchases.length === 0 ? (
        <EmptyState
          icon="bi-credit-card"
          title="Todavía no tenés compras en cuotas"
          description="Registrá una compra en cuotas para hacer seguimiento de lo que falta pagar."
        />
      ) : (
        <div>
          {purchases.map((purchase) => (
            <InstallmentPurchaseCard key={purchase.id} purchase={purchase} />
          ))}
        </div>
      )}

      <BottomSheet open={formOpen} onClose={() => setFormOpen(false)} title="Nueva compra en cuotas">
        <NewPurchaseForm onDone={() => setFormOpen(false)} />
      </BottomSheet>
    </div>
  );
}
