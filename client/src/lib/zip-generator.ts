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

  for (const item of items) {
    if (!item.files || item.files.length === 0) continue;

    // Determine the target folder - start directly from the zip root
    let targetFolder = zip;
    if (item.location) {
      const folderPath = item.location.replace(/\/$/, ''); // Remove trailing slash
      if (folderPath) {
        const newFolder = zip.folder(folderPath);
        if (!newFolder) {
          throw new Error(`Failed to create folder: ${folderPath}`);
        }
        targetFolder = newFolder;
      }
    }

    // For folder items, create a subfolder with the appropriate name
    if (item.type === 'folder') {
      let folderName: string;
      if (item.options.renameFolder) {
        folderName = item.label || `Folder_${Date.now()}`;
      } else {
        // Extract the actual folder name from the first file's webkitRelativePath
        const firstFile = item.files[0];
        if (firstFile && 'webkitRelativePath' in firstFile && firstFile.webkitRelativePath) {
          const pathParts = firstFile.webkitRelativePath.split('/');
          folderName = pathParts[0] || item.label || `Folder_${Date.now()}`;
        } else if (firstFile && firstFile.name) {
          // For drag and drop, webkitRelativePath might be empty, so use the file name
          folderName = firstFile.name;
        } else {
          folderName = item.label || `Folder_${Date.now()}`;
        }
      }
      
      targetFolder = targetFolder.folder(folderName)!;
    }

    // Process files based on item type
    for (const file of item.files) {
      let processedFile = file;
      let fileName = file.name;
      let filePath = fileName;

      // For folder items, handle file structure differently
      if (item.type === 'folder') {
        // If the file has webkitRelativePath (from browse), use it to maintain structure
        if ('webkitRelativePath' in file && file.webkitRelativePath) {
          const relativePath = file.webkitRelativePath;
          const pathParts = relativePath.split('/');
          // Skip the root folder name since we already created it above
          if (pathParts.length > 1) {
            filePath = pathParts.slice(1).join('/');
          } else {
            filePath = pathParts[pathParts.length - 1];
          }
        }
        // For drag-and-drop folders without webkitRelativePath, just use the filename
        // The folder structure is flattened but files are still accessible
      }

      // Apply options
      if (item.options.useTableName && item.type === 'single') {
        const extension = file.name.split('.').pop();
        fileName = `${tableName}.${extension}`;
        filePath = fileName;
      }

      if (item.options.convertToPng && file.type.startsWith('image/')) {
        try {
          const compressionLevel = item.options.pngCompressionLevel || 'low';
          processedFile = await convertImageToPng(file, compressionLevel);
          if (item.options.useTableName && item.type === 'single') {
            fileName = `${tableName}.png`;
            filePath = fileName;
          } else {
            fileName = getFileNameWithoutExtension(file.name) + '.png';
            // Update filePath to reflect the new extension
            if (item.type === 'folder' && 'webkitRelativePath' in file && file.webkitRelativePath) {
              const relativePath = file.webkitRelativePath;
              const pathParts = relativePath.split('/');
              if (pathParts.length > 1) {
                const dirPath = pathParts.slice(1, -1);
                filePath = [...dirPath, fileName].join('/');
              } else {
                filePath = fileName;
              }
            } else {
              filePath = fileName;
            }
          }
        } catch (error) {
          console.warn('Failed to convert image to PNG:', error);
        }
      }

      // Add file to zip
      try {
        // Validate file before adding to zip
        if (!file || !file.name) {
          throw new Error('Invalid file object');
        }
        
        // Check if file is readable
        if (file.size === 0 && file.type === '') {
          // This might be a directory entry, skip it
          console.warn('Skipping directory entry:', file.name);
          continue;
        }

        targetFolder.file(filePath, processedFile);
        processedItems++;

        // Update progress
        if (onProgress) {
          onProgress(Math.round((processedItems / totalItems) * 100));
        }
      } catch (error) {
        console.error('Error adding file to zip:', error, 'File:', file.name, 'Path:', filePath, 'Size:', file.size, 'Type:', file.type);
        throw new Error(`Failed to add file ${file.name} to ZIP package. ${error}`);
      }
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function generateFileTree(items: OrganizationItem[], tableName: string): FileTreeNode {
  const root: FileTreeNode = {
    name: 'root',
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
      
      // Use actual folder name unless rename folder option is enabled
      let folderName: string;
      if (item.options.renameFolder) {
        folderName = item.label || `Folder (${item.files.length} files)`;
      } else {
        // Extract the actual folder name from the first file's webkitRelativePath
        const firstFile = item.files?.[0];
        if (firstFile && 'webkitRelativePath' in firstFile && firstFile.webkitRelativePath) {
          const pathParts = firstFile.webkitRelativePath.split('/');
          folderName = pathParts[0] || item.label || `Folder (${item.files.length} files)`;
        } else if (firstFile && firstFile.name) {
          // For drag and drop, webkitRelativePath might be empty, so use the file name
          // If the file name is the same as a folder name (like when dragging a folder), use that
          folderName = firstFile.name;
        } else {
          folderName = item.label || `Folder (${item.files.length} files)`;
        }
      }
      
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
