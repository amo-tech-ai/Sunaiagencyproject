/**
 * Maps legacy page IDs (used by onNavigate) to URL paths.
 * This allows sub-components to keep using the onNavigate(pageId) pattern
 * while the page-level components translate to react-router navigation.
 */
export function pageToPath(page: string): string {
  const map: Record<string, string> = {
    'home': '/',
    'home-v1': '/home-v1',
    'home-v2': '/',
    'solutions': '/solutions',
    'industries': '/industries',
    'about': '/about',
    'process': '/process',
    'process-v12': '/process',
    'projects': '/projects',
    'agents': '/agents',
    'ai-agents': '/agents',
    'chatbots': '/chatbots',
    'ai-chatbots': '/chatbots',
    'ecommerce': '/industries/e-commerce',
    'industries/e-commerce': '/industries/e-commerce',
    'fashion': '/industries/fashion',
    'industries/fashion': '/industries/fashion',
    'travel': '/industries/travel',
    'industries/travel': '/industries/travel',
    'case-studies': '/case-studies',
    'booking': '/booking',
    'style-guide': '/style-guide',
    'sections': '/sections',
  };
  return map[page] || '/';
}

/**
 * Maps URL paths to legacy page IDs (for Header active state).
 */
export function pathToPage(pathname: string): string {
  const map: Record<string, string> = {
    '/': 'home',
    '/home-v1': 'home',
    '/solutions': 'solutions',
    '/industries': 'industries',
    '/about': 'about',
    '/process': 'process',
    '/projects': 'projects',
    '/agents': 'agents',
    '/chatbots': 'chatbots',
    '/industries/e-commerce': 'industries',
    '/industries/fashion': 'industries',
    '/industries/travel': 'industries',
    '/case-studies': 'case-studies',
    '/booking': 'booking',
    '/style-guide': 'style-guide',
    '/sections': 'sections',
  };
  return map[pathname] || 'home';
}
