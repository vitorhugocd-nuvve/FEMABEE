export const SeverityVariants = {
    default: {
        bg: 'bg-neutral-500',
        border: 'border-neutral-600',
        header: 'bg-gradient-to-r from-neutral-600 to-neutral-500',
        progress: 'accent-neutral-600'
    },
    danger: {
        bg: 'bg-red-100',
        border: 'border-red-400',
        header: 'bg-gradient-to-r from-red-600 to-red-400',
        progress: 'accent-red-600'
    },
    warning: {
        bg: 'bg-yellow-100',
        border: 'border-yellow-400',
        header: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
        progress: 'accent-yellow-600'
    },
    hint: {
        bg: 'bg-blue-100',
        border: 'border-blue-400',
        header: 'bg-gradient-to-r from-blue-600 to-blue-400',
        progress: 'accent-blue-600'
    },
    success: {
        bg: 'bg-green-100',
        border: 'border-green-400',
        header: 'bg-gradient-to-r from-green-600 to-green-400',
        progress: 'accent-green-600'
    },
    conquista: {
        bg: 'bg-amber-100',
        border: 'border-amber-500',
        header: 'bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600',
        progress: 'accent-amber-500'
    }
} as const;

export type SeverityVariantKey = keyof typeof SeverityVariants;
