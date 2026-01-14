import { useEffect, useRef, useCallback } from 'react';
import type {
  InfographicOptions,
  RendererInstance,
  ExportOptions,
} from '../types';

export function useRenderer(containerRef: React.RefObject<HTMLElement>) {
  const rendererRef = useRef<RendererInstance | null>(null);
  const isInitializedRef = useRef(false);
  const pendingListenersRef = useRef<Map<string, Set<(...args: any[]) => void>>>(new Map());
  const attachedListenersRef = useRef<Map<string, Set<(...args: any[]) => void>>>(new Map());

  const createRenderer = useCallback(
    async (options: string | Partial<InfographicOptions>, container: HTMLElement): Promise<RendererInstance> => {
      const { Infographic: InfographicClass } = await import('@antv/infographic');

      let renderer: RendererInstance;

      if (typeof options === 'string') {
        renderer = new InfographicClass(options);
      } else {
        renderer = new InfographicClass({ ...options, container });
      }

      renderer.on('rendered', () => {
        rendererRef.current = renderer;
        isInitializedRef.current = true;

        pendingListenersRef.current.forEach((listeners, event) => {
          listeners.forEach((listener) => {
            renderer.on(event, listener);
          });
        });
        pendingListenersRef.current.clear();
      });

      renderer.on('error', (error) => {
        console.error('[Infographic-for-React] Renderer error:', error);
      });

      if (typeof options === 'string') {
        renderer.render({ container });
      } else {
        renderer.render();
      }

      return renderer;
    },
    [],
  );

  const render = useCallback(
    async (options: string | Partial<InfographicOptions>) => {
      const container = containerRef.current;
      if (!container) {
        throw new Error('Container element not found');
      }

      if (rendererRef.current) {
        if (typeof options === 'string') {
          rendererRef.current.update(options);
        } else {
          rendererRef.current.update({ ...options, container });
        }
      } else {
        await createRenderer(options, container);
      }
    },
    [containerRef, createRenderer],
  );

  const update = useCallback((options: string | Partial<InfographicOptions>) => {
    if (!rendererRef.current) {
      throw new Error('Renderer not initialized. Call render first.');
    }
    rendererRef.current.update(options);
  }, []);

  const toDataURL = useCallback(
    (options?: ExportOptions): Promise<string> => {
      if (!rendererRef.current) {
        throw new Error('Renderer not initialized');
      }
      return rendererRef.current.toDataURL(options);
    },
    [],
  );

  const getTypes = useCallback(() => {
    if (!rendererRef.current) {
      throw new Error('Renderer not initialized');
    }
    return rendererRef.current.getTypes();
  }, []);

  const destroy = useCallback(() => {
    if (rendererRef.current) {
      attachedListenersRef.current.forEach((listeners, event) => {
        listeners.forEach((listener) => {
          rendererRef.current?.off(event, listener);
        });
      });
      attachedListenersRef.current.clear();

      rendererRef.current.destroy();
      rendererRef.current = null;
    }
    isInitializedRef.current = false;
  }, []);

  const on = useCallback((event: string, listener: (...args: any[]) => void) => {
    if (!rendererRef.current) {
      const listeners = pendingListenersRef.current.get(event) || new Set();
      listeners.add(listener);
      pendingListenersRef.current.set(event, listeners);
      return;
    }
    const listeners = attachedListenersRef.current.get(event) || new Set();
    listeners.add(listener);
    attachedListenersRef.current.set(event, listeners);
    rendererRef.current.on(event, listener);
  }, []);

  const off = useCallback((event: string, listener: (...args: any[]) => void) => {
    if (!rendererRef.current) {
      const listeners = pendingListenersRef.current.get(event);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          pendingListenersRef.current.delete(event);
        }
      }
      return;
    }
    rendererRef.current.off(event, listener);
    const listeners = attachedListenersRef.current.get(event);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        attachedListenersRef.current.delete(event);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      destroy();
    };
  }, [destroy]);

  return {
    render,
    update,
    toDataURL,
    getTypes,
    destroy,
    on,
    off,
    isReady: isInitializedRef.current,
  };
}
