import { useState } from 'react';
import type { QueryFilters } from '../logic/queryEngine';
import { useCategories } from '../../categories/hooks/useCategories';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { PaymentMethod } from '../../../db/types';
import { currentPeriod, currentYear, periodBounds, yearBounds } from '../../../shared/utils/dateUtils';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: 'Efectivo',
  [PaymentMethod.Debit]: 'Débito',
  [PaymentMethod.Credit]: 'Crédito',
  [PaymentMethod.Transfer]: 'Transferencia',
  [PaymentMethod.MercadoPago]: 'Mercado Pago',
  [PaymentMethod.Other]: 'Otro',
};

type RangePreset = 'all' | 'this-month' | 'this-year' | 'month';

interface FilterPanelProps {
  filters: QueryFilters;
  onChange: (filters: QueryFilters) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const categories = useCategories();
  const accounts = useAccounts(true);
  const [rangePreset, setRangePreset] = useState<RangePreset>('all');
  const [customMonth, setCustomMonth] = useState(currentPeriod());

  function applyRangePreset(preset: RangePreset) {
    setRangePreset(preset);
    if (preset === 'all') onChange({ ...filters, dateFrom: undefined, dateTo: undefined });
    else if (preset === 'this-month') onChange({ ...filters, ...periodBounds(currentPeriod()) });
    else if (preset === 'this-year') onChange({ ...filters, ...yearBounds(currentYear()) });
    else onChange({ ...filters, ...periodBounds(customMonth) });
  }

  return (
    <div className="card mb-3">
      <div className="card-body d-flex flex-column gap-2">
        <div>
          <label className="form-label small text-secondary mb-1">Tipo</label>
          <div className="btn-group w-100">
            {(['expense', 'income', 'transfer'] as const).map((type) => (
              <button
                key={type}
                type="button"
                className={`btn btn-sm ${filters.type === type ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => onChange({ ...filters, type: filters.type === type ? undefined : type })}
              >
                {type === 'expense' ? 'Gasto' : type === 'income' ? 'Ingreso' : 'Transferencia'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="form-label small text-secondary mb-1">Categoría</label>
          <select
            className="form-select form-select-sm"
            value={filters.categoryId ?? ''}
            onChange={(e) => onChange({ ...filters, categoryId: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label small text-secondary mb-1">Cuenta</label>
          <select
            className="form-select form-select-sm"
            value={filters.accountId ?? ''}
            onChange={(e) => onChange({ ...filters, accountId: e.target.value || undefined })}
          >
            <option value="">Todas</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label small text-secondary mb-1">Método de pago</label>
          <select
            className="form-select form-select-sm"
            value={filters.paymentMethod ?? ''}
            onChange={(e) => onChange({ ...filters, paymentMethod: (e.target.value as PaymentMethod) || undefined })}
          >
            <option value="">Todos</option>
            {Object.values(PaymentMethod).map((pm) => (
              <option key={pm} value={pm}>
                {PAYMENT_METHOD_LABELS[pm]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label small text-secondary mb-1">Rango</label>
          <select
            className="form-select form-select-sm mb-2"
            value={rangePreset}
            onChange={(e) => applyRangePreset(e.target.value as RangePreset)}
          >
            <option value="all">Todo el tiempo</option>
            <option value="this-month">Este mes</option>
            <option value="this-year">Este año</option>
            <option value="month">Mes específico</option>
          </select>
          {rangePreset === 'month' && (
            <input
              type="month"
              className="form-control form-control-sm"
              value={customMonth}
              onChange={(e) => {
                setCustomMonth(e.target.value);
                onChange({ ...filters, ...periodBounds(e.target.value) });
              }}
            />
          )}
        </div>

        <div>
          <label className="form-label small text-secondary mb-1">Buscar en descripción</label>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="ej. combustible"
            value={filters.text ?? ''}
            onChange={(e) => onChange({ ...filters, text: e.target.value || undefined })}
          />
        </div>
      </div>
    </div>
  );
}
