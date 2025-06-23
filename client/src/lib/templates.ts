import { OrganizationTemplate } from '@/types/organization';

// Embedded templates for reliable loading in all environments
const PINBALL_EMPORIUM_TEMPLATE: OrganizationTemplate = {
  "name": "Pinball Emporium Template",
  "version": "1.0.0",
  "metadata": {
    "description": "Standard Pinball Emporium organization structure",
    "author": "File Organizer Pro"
  },
  "items": [
    {
      "id": "table-file",
      "type": "single",
      "label": "Table File",
      "location": "",
      "options": { "useTableName": true }
    },
    {
      "id": "roms-folder",
      "type": "folder",
      "label": "ROMs",
      "location": "roms/",
      "options": {}
    },
    {
      "id": "rom-file",
      "type": "single",
      "label": "ROM File",
      "location": "roms/",
      "options": { "useTableName": true }
    },
    {
      "id": "media-folder",
      "type": "folder",
      "label": "Media",
      "location": "media/",
      "options": {}
    },
    {
      "id": "backglass",
      "type": "single",
      "label": "Backglass",
      "location": "media/",
      "options": { "convertToPng": true }
    },
    {
      "id": "playfield",
      "type": "single",
      "label": "Playfield",
      "location": "media/",
      "options": { "convertToPng": true }
    },
    {
      "id": "apron",
      "type": "single",
      "label": "Apron",
      "location": "media/",
      "options": { "convertToPng": true }
    }
  ]
};

const PINUP_POPPER_TEMPLATE: OrganizationTemplate = {
  "name": "Pinup Popper Template",
  "version": "1.0.0",
  "metadata": {
    "description": "Standard Pinup Popper organization structure",
    "author": "File Organizer Pro"
  },
  "items": [
    {
      "id": "table-file",
      "type": "single",
      "label": "Table File",
      "location": "tables/",
      "options": { "useTableName": true }
    },
    {
      "id": "tables-folder",
      "type": "folder",
      "label": "Tables",
      "location": "tables/",
      "options": {}
    },
    {
      "id": "roms-folder",
      "type": "folder",
      "label": "ROMs",
      "location": "roms/",
      "options": {}
    },
    {
      "id": "rom-file",
      "type": "single",
      "label": "ROM File",
      "location": "roms/",
      "options": { "useTableName": true }
    },
    {
      "id": "media-folder",
      "type": "folder",
      "label": "Media",
      "location": "media/Visual Pinball X/",
      "options": {}
    },
    {
      "id": "backglass-folder",
      "type": "folder",
      "label": "Backglass Media",
      "location": "media/Visual Pinball X/Backglass Images/",
      "options": {}
    },
    {
      "id": "backglass",
      "type": "single",
      "label": "Backglass",
      "location": "media/Visual Pinball X/Backglass Images/",
      "options": { "convertToPng": true }
    },
    {
      "id": "table-images-folder",
      "type": "folder",
      "label": "Table Images",
      "location": "media/Visual Pinball X/Table Images/",
      "options": {}
    },
    {
      "id": "table-image",
      "type": "single",
      "label": "Table Image",
      "location": "media/Visual Pinball X/Table Images/",
      "options": { "convertToPng": true }
    }
  ]
};

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

// Pre-loaded templates
export const BUILTIN_TEMPLATES: Record<string, OrganizationTemplate> = {
  'pinball-emporium': PINBALL_EMPORIUM_TEMPLATE,
  'pinup-popper': PINUP_POPPER_TEMPLATE
};

// Template loading function with embedded fallback
export async function loadTemplate(templateName: string): Promise<OrganizationTemplate> {
  // First try embedded templates
  if (BUILTIN_TEMPLATES[templateName]) {
    return BUILTIN_TEMPLATES[templateName];
  }
  
  // Fallback to fetch for custom templates
  try {
    const response = await fetch(`/templates/${templateName}.json`);
    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn(`Failed to fetch template ${templateName}:`, error);
  }
  
  throw new Error(`Template not found: ${templateName}`);
}

// Initialize function (now synchronous since templates are embedded)
export function initializeTemplates(): void {
  // Templates are already embedded, no async loading needed
  console.log('Templates initialized:', Object.keys(BUILTIN_TEMPLATES));
}
