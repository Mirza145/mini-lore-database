import Modal from './Modal.jsx';
import { ErrorMessage } from './Feedback.jsx';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Delete',
  busyLabel = 'Deleting…',
  busy = false,
  error = null,
  onCancel,
  onConfirm,
}) {
  return (
    <Modal open={open} onClose={busy ? () => {} : onCancel} title={title} description={description}>
      {error ? <ErrorMessage error={error} title="Could not complete that action" className="mb-4" /> : null}

      <div className="flex justify-end gap-2">
        <button type="button" className="btn-secondary" onClick={onCancel} disabled={busy}>
          Cancel
        </button>
        <button
          type="button"
          className="btn bg-crimson text-white shadow-sm hover:bg-crimson-dark"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? busyLabel : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
