export interface OrganizationItem {
  id: string;
  type: 'single' | 'multiple' | 'folder';
  label: string;
  location: string;
  options: {
    useTableName?: boolean;
    convertToPng?: boolean;
    pngCompressionLevel?: 'none' | 'low' | 'high';
    renameFolder?: boolean;
  };
  files?: File[];
}

export interface OrganizationTemplate {
  name: string;
  version: string;
  items: Omit<OrganizationItem, 'files'>[];
  metadata?: {
    description?: string;
    author?: string;
    created?: string;
  };
}

export interface FileTreeNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  children?: FileTreeNode[];
}

export interface PackageSummary {
  fileCount: number;
  folderCount: number;
  totalSize: number;
}
