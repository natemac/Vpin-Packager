import { OrganizationTemplate } from '@/types/organization';

export const BUILTIN_TEMPLATES: Record<string, OrganizationTemplate> = {
  pinballEmporium: {
    name: 'Pinball Emporium Template',
    version: '1.0.0',
    metadata: {
      description: 'Standard Pinball Emporium organization structure',
      author: 'File Organizer Pro'
    },
    items: [
      {
        id: 'table-file',
        type: 'single',
        label: 'Table File',
        location: '',
        options: { useTableName: true }
      },
      {
        id: 'roms-folder',
        type: 'folder',
        label: 'ROMs',
        location: 'roms/',
        options: {}
      },
      {
        id: 'rom-file',
        type: 'single',
        label: 'ROM File',
        location: 'roms/',
        options: { useTableName: true }
      },
      {
        id: 'media-folder',
        type: 'folder',
        label: 'Media',
        location: 'media/',
        options: {}
      },
      {
        id: 'backglass',
        type: 'single',
        label: 'Backglass',
        location: 'media/',
        options: { convertToPng: true }
      },
      {
        id: 'playfield',
        type: 'single',
        label: 'Playfield',
        location: 'media/',
        options: { convertToPng: true }
      },
      {
        id: 'apron',
        type: 'single',
        label: 'Apron',
        location: 'media/',
        options: { convertToPng: true }
      }
    ]
  },
  pinupPopper: {
    name: 'Pinup Popper Template',
    version: '1.0.0',
    metadata: {
      description: 'Standard Pinup Popper organization structure',
      author: 'File Organizer Pro'
    },
    items: [
      {
        id: 'table-file',
        type: 'single',
        label: 'Table File',
        location: 'tables/',
        options: { useTableName: true }
      },
      {
        id: 'tables-folder',
        type: 'folder',
        label: 'Tables',
        location: 'tables/',
        options: {}
      },
      {
        id: 'roms-folder',
        type: 'folder',
        label: 'ROMs',
        location: 'roms/',
        options: {}
      },
      {
        id: 'rom-file',
        type: 'single',
        label: 'ROM File',
        location: 'roms/',
        options: { useTableName: true }
      },
      {
        id: 'media-folder',
        type: 'folder',
        label: 'Media',
        location: 'media/Visual Pinball X/',
        options: {}
      },
      {
        id: 'backglass-folder',
        type: 'folder',
        label: 'Backglass Media',
        location: 'media/Visual Pinball X/Backglass Images/',
        options: {}
      },
      {
        id: 'backglass',
        type: 'single',
        label: 'Backglass',
        location: 'media/Visual Pinball X/Backglass Images/',
        options: { convertToPng: true }
      },
      {
        id: 'table-images-folder',
        type: 'folder',
        label: 'Table Images',
        location: 'media/Visual Pinball X/Table Images/',
        options: {}
      },
      {
        id: 'table-image',
        type: 'single',
        label: 'Table Image',
        location: 'media/Visual Pinball X/Table Images/',
        options: { convertToPng: true }
      }
    ]
  }
};
