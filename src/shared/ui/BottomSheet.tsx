import { type ReactNode, useLayoutEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

// Every open sheet gets its own z-index tier, strictly above whatever was already open.
// A single shared {backdrop: 1040, sheet: 1050} pair (the old approach) breaks as soon as a
// sheet opens another sheet: the inner backdrop (1040) would sit BELOW the outer sheet (1050)
// no matter what, since z-index compares across the whole stacking context, not per pair —
// so tapping "outside" the inner sheet actually hit the outer sheet behind it, not its backdrop.
// Assigned via state (not a ref) and in useLayoutEffect (not useEffect) so the computed value
// is committed to the DOM before paint — a ref write here wouldn't trigger the re-render needed
// to actually apply the new z-index, and useEffect would let one stale frame paint first.
let openSheetCount = 0;

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const [zIndex, setZIndex] = useState<number>();

  useLayoutEffect(() => {
    if (!open) return;
    openSheetCount += 1;
    setZIndex(1040 + openSheetCount * 20);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      openSheetCount -= 1;
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  if (!open || zIndex === undefined) return null;

  return createPortal(
    <>
      <div className="bottom-sheet-backdrop" style={{ zIndex }} onClick={onClose} />
      <div
        className="bottom-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ zIndex: zIndex + 10 }}
      >
        <div className="bottom-sheet-handle" />
        {title && <h2 className="h5 mb-3">{title}</h2>}
        {children}
      </div>
    </>,
    document.body,
  );
}
