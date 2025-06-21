import { OrganizationTemplate } from '@/types/organization';

// Template loading functions
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

// Legacy export for backwards compatibility
export const BUILTIN_TEMPLATES: Record<string, OrganizationTemplate> = {};
