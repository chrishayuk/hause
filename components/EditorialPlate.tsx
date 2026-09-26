import type { ReactNode } from 'react';
import '../notebook.css';

/** Image scale and caption stay authored; media and its provenance belong to the publication. */
export function EditorialPlate({ children, caption, layout = 'wide', className = '' }: { children: ReactNode; caption: ReactNode; layout?: 'wide' | 'inset' | 'portrait'; className?: string }) {
 return <figure className={`hause-editorial-plate ${className}`} data-layout={layout}><div className="editorial-plate-image">{children}</div><figcaption>{caption}</figcaption></figure>;
}
