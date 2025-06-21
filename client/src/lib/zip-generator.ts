import JSZip from 'jszip';
import { OrganizationItem, FileTreeNode, PackageSummary } from '@/types/organization';
import { getFileNameWithoutExtension, convertImageToPng, formatFileSize } from './file-utils';

export async function generateZipFromOrganization(
  items: OrganizationItem[],
  tableName: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  let processedItems = 0;
  const totalItems = items.reduce((sum, item) => sum + (item.files?.length || 0), 0);

  // Create the main folder using table name
  const mainFolder = zip.folder(tableName);
  if (!mainFolder) {
    throw new Error('Failed to create main folder');
  }

  for (const item of items) {
    if (!item.files || item.files.length === 0) continue;

    // Determine the target folder
    let targetFolder = mainFolder;
    if (item.location) {
      const folderPath = item.location.replace(/\/$/, ''); // Remove trailing slash
      if (folderPath) {
        targetFolder = mainFolder.folder(folderPath);
        if (!targetFolder) {
          throw new Error(`Failed to create folder: ${folderPath}`);
        }
      }
    }

    // Process files based on item type
    for (const file of item.files) {
      let processedFile = file;
      let fileName = file.name;

      // Apply options
      if (item.options.useTableName) {
        const extension = file.name.split('.').pop();
        fileName = `${tableName}.${extension}`;
      }

      if (item.options.convertToPng && file.type.startsWith('image/')) {
        try {
          processedFile = await convertImageToPng(file);
          if (item.options.useTableName) {
            fileName = `${tableName}.png`;
          } else {
            fileName = getFileNameWithoutExtension(file.name) + '.png';
          }
        } catch (error) {
          console.warn('Failed to convert image to PNG:', error);
        }
      }

      // Add file to zip
      targetFolder.file(fileName, processedFile);
      processedItems++;

      // Update progress
      if (onProgress) {
        onProgress(Math.round((processedItems / totalItems) * 100));
      }
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function generateFileTree(items: OrganizationItem[], tableName: string): FileTreeNode {
  const root: FileTreeNode = {
    name: tableName,
    type: 'folder',
    path: '',
    children: []
  };

  // Create a map to track folders
  const folderMap = new Map<string, FileTreeNode>();
  folderMap.set('', root);

  // Sort items by location to ensure folders are created before files
  const sortedItems = [...items].sort((a, b) => {
    const aDepth = (a.location.match(/\//g) || []).length;
    const bDepth = (b.location.match(/\//g) || []).length;
    return aDepth - bDepth;
  });

  for (const item of sortedItems) {
    if (!item.files || item.files.length === 0) continue;

    // Create necessary folders
    if (item.location) {
      const pathParts = item.location.split('/').filter(part => part);
      let currentPath = '';
      let currentParent = root;

      for (const part of pathParts) {
        const newPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!folderMap.has(newPath)) {
          const folderNode: FileTreeNode = {
            name: part,
            type: 'folder',
            path: newPath,
            children: []
          };
          
          currentParent.children!.push(folderNode);
          folderMap.set(newPath, folderNode);
        }
        
        currentParent = folderMap.get(newPath)!;
        currentPath = newPath;
      }
    }

    // Handle folder items differently - show as single collapsed folder
    if (item.type === 'folder') {
      const targetFolder = folderMap.get(item.location.replace(/\/$/, '')) || root;
      
      // Add a single folder node representing the uploaded folder
      const folderName = item.label || `Folder (${item.files.length} files)`;
      const folderNode: FileTreeNode = {
        name: folderName,
        type: 'folder',
        path: item.location ? `${item.location}${folderName}` : folderName,
        children: [] // Empty children to show as collapsed
      };

      targetFolder.children!.push(folderNode);
    } else {
      // Add individual files for single/multiple file items
      const targetFolder = folderMap.get(item.location.replace(/\/$/, '')) || root;
      
      for (const file of item.files) {
        let fileName = file.name;
        
        if (item.options.useTableName) {
          const extension = file.name.split('.').pop();
          fileName = `${tableName}.${extension}`;
        }
        
        if (item.options.convertToPng && file.type.startsWith('image/')) {
          fileName = getFileNameWithoutExtension(fileName) + '.png';
        }

        const fileNode: FileTreeNode = {
          name: fileName,
          type: 'file',
          path: item.location ? `${item.location}${fileName}` : fileName,
          size: file.size
        };

        targetFolder.children!.push(fileNode);
      }
    }
  }

  return root;
}

export function calculatePackageSummary(items: OrganizationItem[]): PackageSummary {
  let fileCount = 0;
  let totalSize = 0;
  const folders = new Set<string>();

  for (const item of items) {
    if (item.files) {
      fileCount += item.files.length;
      totalSize += item.files.reduce((sum, file) => sum + file.size, 0);
    }

    if (item.location) {
      const pathParts = item.location.split('/').filter(part => part);
      let currentPath = '';
      
      for (const part of pathParts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        folders.add(currentPath);
      }
    }
  }

  return {
    fileCount,
    folderCount: folders.size,
    totalSize
  };
}
