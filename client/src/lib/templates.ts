import { OrganizationTemplate } from '@/types/organization';

// Static template loading from public directory
export async function loadTemplate(templateName: string): Promise<OrganizationTemplate> {
  try {
    const response = await fetch(`/templates/${templateName}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load template: ${templateName}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw error;
  }
}

// Available built-in templates
export const BUILTIN_TEMPLATE_CONFIGS = {
  pinballEmporium: {
    key: 'pinball-emporium',
    name: 'Pinball Emporium',
    description: 'Standard Pinball Emporium organization structure'
  },
  pinupPopper: {
    key: 'pinup-popper',
    name: 'Pinup Popper',
    description: 'Standard Pinup Popper organization structure'
  }
};

// Pre-loaded templates for immediate access
let templateCache: Record<string, OrganizationTemplate> = {};

// Load all templates at startup
export async function initializeTemplates(): Promise<void> {
  try {
    const templatePromises = Object.values(BUILTIN_TEMPLATE_CONFIGS).map(async (config) => {
      const template = await loadTemplate(config.key);
      templateCache[config.key] = template;
      return template;
    });
    
    await Promise.all(templatePromises);
  } catch (error) {
    console.warn('Some templates failed to load:', error);
  }
}

export const BUILTIN_TEMPLATES = templateCache;
