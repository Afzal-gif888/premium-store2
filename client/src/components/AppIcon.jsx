import React, { useEffect, useState } from 'react';

// Dynamic icon loader with simple cache to avoid bundling the entire lucide-react
// This reduces initial bundle size and lets the icon component load on-demand.
const moduleCache = { module: null };
const iconCache = {};

async function importLucideModule() {
    if (moduleCache.module) return moduleCache.module;
    // import the library when needed
    // Try synchronous require first (helps test environments and Node-based runners)
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const sync = require('lucide-react');
        moduleCache.module = sync;
        return sync;
    } catch (e) {
        // fall back to dynamic import
    }
    const mod = await import('lucide-react');
    moduleCache.module = mod;
    return mod;
}

function Icon({ name, size = 24, color = 'currentColor', className = '', strokeWidth = 2, ...props }) {
        const [Component, setComponent] = useState(() => iconCache[name] || null);

        // If the lucide module is already loaded in cache, pick the component synchronously
        const SyncComponent = (iconCache[name]
            || (moduleCache.module && (moduleCache.module[name] || moduleCache.module.HelpCircle))
            || null);

    useEffect(() => {
        let mounted = true;
            if (Component) return; // already loaded
            if (SyncComponent) {
                // populate cache so render can pick it synchronously next render
                iconCache[name] = SyncComponent;
                setComponent(() => SyncComponent);
                return;
            }

        (async () => {
            try {
                // load module once then pick named export
                const mod = await importLucideModule();
                const Exported = mod && mod[name] ? mod[name] : mod && mod.HelpCircle ? mod.HelpCircle : null;
                if (Exported) {
                    iconCache[name] = Exported;
                    if (mounted) setComponent(() => Exported);
                }
            } catch (e) {
                // fallback silently
                console.error('Failed to load icon', name, e);
            }
        })();

        return () => { mounted = false; };
    }, [name]);

    const Fallback = (p) => (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className={p.className}
            aria-hidden
            {...props}
        >
            <rect width={size} height={size} fill="transparent" />
        </svg>
    );

        const RenderComp = Component || Fallback;

        // Ensure the rendered SVG gets a predictable lucide-like class so tests and styling
        // relying on the name + kebab-case continue to work.
        const toKebab = (str = '') =>
            str
                .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
                .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
                .toLowerCase();

        const defaultClass = name ? `lucide-${toKebab(name)}` : '';
        const combinedClassName = [defaultClass, className].filter(Boolean).join(' ');

        return <RenderComp size={size} color={color} strokeWidth={strokeWidth} className={combinedClassName} {...props} />;
}

export default Icon;