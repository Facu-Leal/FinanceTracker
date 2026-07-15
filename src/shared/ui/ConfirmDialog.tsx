import { BottomSheet } from './BottomSheet';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  danger,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <BottomSheet open={open} onClose={onCancel} title={title}>
      {description && <p className="text-secondary">{description}</p>}
      <div className="d-flex gap-2 mt-3">
        <button type="button" className="btn btn-outline-secondary flex-fill" onClick={onCancel}>
          Cancelar
        </button>
        <button
          type="button"
          className={`btn flex-fill ${danger ? 'btn-danger' : 'btn-primary'}`}
          onClick={onConfirm}
        >
          {confirmLabel}
        </button>
      </div>
    </BottomSheet>
  );
}
