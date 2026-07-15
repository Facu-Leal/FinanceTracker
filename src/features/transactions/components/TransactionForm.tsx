import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { createTransaction } from '../../../db/repositories/transactions.repo';
import { AmountInput } from '../../../shared/ui/AmountInput';
import { CategoryPicker } from '../../categories/components/CategoryPicker';
import { useAccounts } from '../../accounts/hooks/useAccounts';
import { parseAmountToCents } from '../../../shared/utils/currency';
import { todayISO } from '../../../shared/utils/dateUtils';
import { PaymentMethod } from '../../../db/types';

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.Cash]: 'Efectivo',
  [PaymentMethod.Debit]: 'Débito',
  [PaymentMethod.Credit]: 'Crédito',
  [PaymentMethod.Transfer]: 'Transferencia',
  [PaymentMethod.MercadoPago]: 'Mercado Pago',
  [PaymentMethod.Other]: 'Otro',
};

type TxnType = 'expense' | 'income' | 'transfer';

interface TransactionFormValues {
  amount: string;
  description: string;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
  paymentMethod: PaymentMethod;
  date: string;
  notes?: string;
}

interface TransactionFormProps {
  onDone: () => void;
}

export function TransactionForm({ onDone }: TransactionFormProps) {
  const [type, setType] = useState<TxnType>('expense');
  const [showMore, setShowMore] = useState(false);
  const accounts = useAccounts();

  const { control, register, handleSubmit, watch, setValue, formState } = useForm<TransactionFormValues>({
    defaultValues: {
      amount: '',
      description: '',
      accountId: '',
      paymentMethod: PaymentMethod.Cash,
      date: todayISO(),
    },
  });

  const accountId = watch('accountId');

  // Accounts load asynchronously (useLiveQuery); default to the first one once available
  // so a single-account user never has to touch the picker to register a transaction.
  useEffect(() => {
    if (!accountId && accounts.length > 0) {
      setValue('accountId', accounts[0]!.id);
    }
  }, [accounts, accountId, setValue]);

  async function onSubmit(values: TransactionFormValues) {
    await createTransaction({
      type,
      date: values.date,
      amount: parseAmountToCents(values.amount),
      description: values.description.trim(),
      categoryId: type === 'transfer' ? undefined : values.categoryId,
      accountId: values.accountId,
      toAccountId: type === 'transfer' ? values.toAccountId : undefined,
      paymentMethod: type === 'transfer' ? undefined : values.paymentMethod,
      notes: values.notes?.trim() || undefined,
    });
    onDone();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="btn-group w-100 mb-2">
        <button
          type="button"
          className={`btn ${type === 'expense' ? 'btn-danger' : 'btn-outline-secondary'}`}
          onClick={() => setType('expense')}
        >
          Gasto
        </button>
        <button
          type="button"
          className={`btn ${type === 'income' ? 'btn-success' : 'btn-outline-secondary'}`}
          onClick={() => setType('income')}
        >
          Ingreso
        </button>
        <button
          type="button"
          className={`btn ${type === 'transfer' ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => setType('transfer')}
        >
          Transferencia
        </button>
      </div>

      <Controller
        control={control}
        name="amount"
        rules={{ validate: (v) => parseAmountToCents(v || '0') > 0 || 'Ingresá un monto' }}
        render={({ field }) => <AmountInput value={field.value} onChange={field.onChange} autoFocus />}
      />

      <div className="mb-2">
        <input
          className="form-control"
          placeholder="Descripción (ej. Supermercado: leche, pan, arroz)"
          {...register('description', { required: true })}
        />
      </div>

      {type !== 'transfer' && (
        <div className="mb-2">
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <CategoryPicker kind={type} value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
      )}

      <div className="mb-2">
        <label className="form-label small text-secondary mb-1">
          {type === 'transfer' ? 'Cuenta origen' : 'Cuenta'}
        </label>
        <select className="form-select" {...register('accountId', { required: true })}>
          <option value="" disabled>
            Elegir...
          </option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      {type === 'transfer' && (
        <div className="mb-2">
          <label className="form-label small text-secondary mb-1">Cuenta destino</label>
          <select className="form-select" {...register('toAccountId', { required: type === 'transfer' })}>
            <option value="">Elegir...</option>
            {accounts
              .filter((a) => a.id !== accountId)
              .map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
          </select>
        </div>
      )}

      {type !== 'transfer' && (
        <div className="mb-2">
          <label className="form-label small text-secondary mb-1">Método de pago</label>
          <select className="form-select" {...register('paymentMethod')}>
            {Object.values(PaymentMethod).map((pm) => (
              <option key={pm} value={pm}>
                {PAYMENT_METHOD_LABELS[pm]}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-2">
        <label className="form-label small text-secondary mb-1">Fecha</label>
        <input type="date" className="form-control" {...register('date', { required: true })} />
      </div>

      <button
        type="button"
        className="btn btn-link btn-sm px-0 text-decoration-none"
        onClick={() => setShowMore((v) => !v)}
      >
        {showMore ? 'Ocultar' : 'Más opciones (notas)'}
      </button>

      {showMore && (
        <div className="mb-2">
          <textarea className="form-control" placeholder="Notas" rows={2} {...register('notes')} />
        </div>
      )}

      <button type="submit" className="btn btn-primary w-100 mt-2" disabled={formState.isSubmitting || accounts.length === 0}>
        Guardar
      </button>
    </form>
  );
}
