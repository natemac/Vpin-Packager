// Help content for all components in the File Organizer Pro application
export interface HelpContent {
  title: string;
  description: string;
}

export const HELP_CONTENT: Record<string, HelpContent> = {
  // File Upload Zone
  'file-upload': {
    title: 'File Upload',
    description: 'Drag and drop your pinball table file here, or click to browse. This will be the main table file that everything else gets organized around.'
  },

  // Organization Builder
  'organization-builder': {
    title: 'Item Collection Structure',
    description: 'Build your file organization structure by adding different types of items. You can organize ROMs, media files, backglasses, and other pinball assets into folders.'
  },

  // Table Information Section
  'table-info': {
    title: 'Table Information',
    description: 'Set the table name and location path. The table name will be used to automatically name folders and files throughout your organization structure.'
  },

  // Organization Items
  'organization-item': {
    title: 'Organization Item',
    description: 'Each item represents a file or folder in your final package. Click to select files, or drag and drop files directly onto the item. Use the edit button to customize options.'
  },

  // Single File Item
  'item-single': {
    title: 'Single File Item',
    description: 'This item will contain exactly one file. Perfect for unique files like table scripts, instruction cards, or specific media files.'
  },

  // Multiple Files Item
  'item-multiple': {
    title: 'Multiple Files Item',
    description: 'This item can contain multiple files of the same type. Great for collections like wheel images, table videos, or sound files.'
  },

  // Folder Item
  'item-folder': {
    title: 'Folder Item',
    description: 'This creates a folder structure. You can organize related files into subfolders and customize the folder naming conventions.'
  },

  // File Tree Preview
  'file-tree-preview': {
    title: 'File Tree Preview',
    description: 'This shows exactly how your final package will be structured. Folders and files are organized according to your configuration before generating the ZIP file.'
  },

  // Package Generator
  'package-generator': {
    title: 'Package Generator',
    description: 'Generate a ZIP file containing all your organized files. You can choose whether to include the original table file in the package.'
  },

  // Quick Actions
  'quick-actions': {
    title: 'Quick Actions',
    description: 'Save your current organization as a template for future use, load existing templates, or clear the interface to start over.'
  },

  // Template Manager
  'template-manager': {
    title: 'Template Manager',
    description: 'Manage your saved organization templates. Load templates to quickly set up common file structures for different pinball platforms.'
  },

  // Preset Items Dialog
  'preset-items': {
    title: 'Preset Items',
    description: 'Add pre-configured items for popular pinball platforms like Pinball Emporium and Pinup Popper. These presets include the most common file organization patterns.'
  },

  // Built-in Templates
  'builtin-templates': {
    title: 'Built-in Templates',
    description: 'Ready-made organization templates for popular pinball front-ends. These templates include all the standard folders and file types used by each platform.'
  }
};

export function getHelpContent(key: string): HelpContent {
  return HELP_CONTENT[key] || {
    title: 'Help',
    description: 'No help content available for this item.'
  };
}