export const dxeSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
export type DxeSize = (typeof dxeSizes)[number];

export const dxeColors = ['ghost', 'primary', 'secondary', 'accent', 'neutral', 'info', 'success', 'warning', 'error'] as const;
export type DxeColor = (typeof dxeColors)[number];
