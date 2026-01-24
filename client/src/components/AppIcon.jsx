import React from 'react';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    // Safety check for LucideIcons object
    const IconComponent = (LucideIcons && name) ? LucideIcons[name] : null;

    if (!IconComponent) {
        // Double safety for HelpCircle
        const Fallback = HelpCircle;
        if (Fallback) {
            return <Fallback size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
        }
        return <span className={className} style={{ width: size, height: size, display: 'inline-block' }}>?</span>;
    }

    try {
        return <IconComponent
            size={size}
            color={color}
            strokeWidth={strokeWidth}
            className={className}
            {...props}
        />;
    } catch (e) {
        console.error("Icon render error:", e);
        return <span className={className}>!</span>;
    }
}
export default Icon;