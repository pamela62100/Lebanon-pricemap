import { useSearchParams, useNavigate } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

/**
 * useRouteDialog — URL-driven dialog state management.
 *
 * Every dialog is controlled by `?dialog=<dialogId>` in the URL.
 * Additional params like `&id=<entityId>` pass context to the dialog.
 *
 * Benefits:
 * - Dialogs survive page refresh
 * - Deep-linkable / bookmarkable
 * - History-aware (browser back closes dialog)
 */
export function useRouteDialog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  /** Currently active dialog ID (or null if none) */
  const activeDialog = useMemo(
    () => searchParams.get('dialog'),
    [searchParams]
  );

  /** Check if a specific dialog is currently open */
  const isOpen = useCallback(
    (dialogId: string) => activeDialog === dialogId,
    [activeDialog]
  );

  /**
   * Open a dialog by setting URL search params.
   * @param dialogId - The dialog identifier (e.g. 'edit-profile', 'ban-user')
   * @param params - Optional key-value pairs (e.g. { id: 'u1' })
   */
  const open = useCallback(
    (dialogId: string, params?: Record<string, string>) => {
      const next = new URLSearchParams(searchParams);
      next.set('dialog', dialogId);
      if (params) {
        Object.entries(params).forEach(([k, v]) => next.set(k, v));
      }
      setSearchParams(next, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  /** Close the current dialog by removing dialog-related params */
  const close = useCallback(() => {
    const next = new URLSearchParams(searchParams);
    next.delete('dialog');
    next.delete('id');
    next.delete('name');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  /** Read a param value from the current URL */
  const getParam = useCallback(
    (key: string) => searchParams.get(key),
    [searchParams]
  );

  return { activeDialog, isOpen, open, close, getParam };
}
