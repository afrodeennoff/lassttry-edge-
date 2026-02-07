import { prisma } from './prisma'

export interface BundleReport {
  totalSize: number
  gzippedSize: number
  modules: BundleModule[]
  recommendations: string[]
}

export interface BundleModule {
  name: string
  size: number
  gzippedSize: number
  percentage: number
}

export const BUNDLE_ANALYSIS = {
  largeDependencies: [
    {
      name: 'd3',
      size: 245,
      reason: 'Full D3 library imported',
      recommendation: 'Use individual D3 modules or lightweight alternatives like visx',
      priority: 'HIGH',
    },
    {
      name: '@tiptap',
      size: 180,
      reason: 'Full TipTap editor suite',
      recommendation: 'Lazy load TipTap components, only load when editor is opened',
      priority: 'MEDIUM',
    },
    {
      name: 'recharts',
      size: 150,
      reason: 'Chart library',
      recommendation: 'Consider lightweight alternatives or lazy load chart components',
      priority: 'MEDIUM',
    },
    {
      name: 'framer-motion',
      size: 120,
      reason: 'Animation library',
      recommendation: 'Use CSS animations for simple transitions, lazy load complex animations',
      priority: 'LOW',
    },
    {
      name: 'canvas-confetti',
      size: 45,
      reason: 'Confetti animations',
      recommendation: 'Load only when celebration is triggered',
      priority: 'LOW',
    },
    {
      name: 'jspdf',
      size: 150,
      reason: 'PDF generation',
      recommendation: 'Server-side PDF generation or lazy load on export action',
      priority: 'MEDIUM',
    },
    {
      name: 'exceljs',
      size: 200,
      reason: 'Excel export',
      recommendation: 'Server-side export or lazy load on export action',
      priority: 'MEDIUM',
    },
  ],
  
  unusedCode: [
    'Unused Radix UI components',
    'Multiple chart libraries (d3, recharts) - consolidate to one',
    'Duplicate date utilities (date-fns, chrono)',
    'Unused translation locales',
  ],
  
  optimizationSuggestions: [
    {
      category: 'Code Splitting',
      items: [
        'Split charts into separate chunks',
        'Lazy load TipTap editor',
        'Dynamic import for export functionality (PDF/Excel)',
        'Route-based splitting for admin panel',
        'Component lazy loading for modals',
      ],
    },
    {
      category: 'Tree Shaking',
      items: [
        'Use named imports instead of default imports',
        'Remove unused exports',
        'Enable production mode in dependencies',
        'Use ES modules only',
      ],
    },
    {
      category: 'Asset Optimization',
      items: [
        'Compress and optimize images',
        'Use WebP format with fallbacks',
        'Implement lazy loading for images',
        'Remove base64 images from database',
        'Use CDNs for static assets',
      ],
    },
    {
      category: 'Dependencies',
      items: [
        'Replace d3 with visx or lightweight chart library',
        'Consolidate to one chart library',
        'Use date-fns only, remove chrono',
        'Remove duplicate utility libraries',
        'Consider smaller alternatives to heavy packages',
      ],
    },
  ],
}

export function getHeavyPackages(): string[] {
  return BUNDLE_ANALYSIS.largeDependencies
    .filter(dep => dep.priority === 'HIGH' || dep.priority === 'MEDIUM')
    .map(dep => dep.name)
}

export function getOptimizationPriority(): {
  high: string[]
  medium: string[]
  low: string[]
} {
  const high = BUNDLE_ANALYSIS.largeDependencies
    .filter(dep => dep.priority === 'HIGH')
    .map(dep => dep.name)
  
  const medium = BUNDLE_ANALYSIS.largeDependencies
    .filter(dep => dep.priority === 'MEDIUM')
    .map(dep => dep.name)
  
  const low = BUNDLE_ANALYSIS.largeDependencies
    .filter(dep => dep.priority === 'LOW')
    .map(dep => dep.name)
  
  return { high, medium, low }
}

export function generateOptimizationReport(): string {
  const lines: string[] = []
  
  lines.push('# Bundle Optimization Report')
  lines.push('')
  lines.push('## Large Dependencies')
  lines.push('')
  
  BUNDLE_ANALYSIS.largeDependencies.forEach(dep => {
    lines.push(`### ${dep.name} (${dep.priority} Priority)`)
    lines.push(`- Size: ~${dep.size} KB`)
    lines.push(`- Issue: ${dep.reason}`)
    lines.push(`- Recommendation: ${dep.recommendation}`)
    lines.push('')
  })
  
  lines.push('## Optimization Suggestions')
  lines.push('')
  
  BUNDLE_ANALYSIS.optimizationSuggestions.forEach(category => {
    lines.push(`### ${category.category}`)
    category.items.forEach(item => {
      lines.push(`- ${item}`)
    })
    lines.push('')
  })
  
  return lines.join('\n')
}
