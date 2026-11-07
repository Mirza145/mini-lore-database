import { useEffect, useRef, useState } from 'react';

/**
 * Runs an async loader and tracks loading/error state.
 * Pass a dependency array to refetch when inputs (search text, filters) change.
 */
export function useApi(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0);
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let active = true;
    setState((previous) => ({ ...previous, loading: true, error: null }));

    loaderRef
      .current()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (active) setState((previous) => ({ ...previous, loading: false, error }));
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  return { ...state, reload: () => setVersion((value) => value + 1) };
}

export function useDebouncedValue(value, delay = 250) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
