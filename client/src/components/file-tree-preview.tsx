import { TreePine, FolderOpen, Folder, File, Image } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationItem, FileTreeNode } from '@/types/organization';
import { generateFileTree } from '@/lib/zip-generator';
import { isImageFile } from '@/lib/file-utils';

interface FileTreePreviewProps {
  items: OrganizationItem[];
  tableName: string;
}

function TreeNode({ node, depth = 0 }: { node: FileTreeNode; depth?: number }) {
  const getFileIcon = (fileName: string) => {
    if (isImageFile(fileName)) {
      return <Image className="text-purple-500 h-4 w-4" />;
    }
    return <File className="text-blue-500 h-4 w-4" />;
  };

  return (
    <div className="text-sm font-mono">
      <div 
        className="flex items-center text-slate-700 py-1"
        style={{ marginLeft: `${depth * 16}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {depth === 0 ? (
              <FolderOpen className="text-yellow-500 mr-2 h-4 w-4" />
            ) : (
              <Folder className="text-yellow-500 mr-2 h-4 w-4" />
            )}
            <span>{node.name}/</span>
          </>
        ) : (
          <>
            {getFileIcon(node.name)}
            <span className="ml-2">{node.name}</span>
          </>
        )}
      </div>
      
      {node.children?.map((child, index) => (
        <TreeNode key={`${child.path}-${index}`} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export default function FileTreePreview({ items, tableName }: FileTreePreviewProps) {
  const fileTree = tableName ? generateFileTree(items, tableName) : null;
  
  const stats = fileTree ? {
    files: countFiles(fileTree),
    folders: countFolders(fileTree) - 1 // Subtract 1 for root folder
  } : { files: 0, folders: 0 };

  function countFiles(node: FileTreeNode): number {
    let count = node.type === 'file' ? 1 : 0;
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + countFiles(child), 0);
    }
    return count;
  }

  function countFolders(node: FileTreeNode): number {
    let count = node.type === 'folder' ? 1 : 0;
    if (node.children) {
      count += node.children.reduce((sum, child) => sum + countFolders(child), 0);
    }
    return count;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TreePine className="text-primary mr-2 h-5 w-5" />
          File Structure Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        {fileTree ? (
          <>
            <div className="space-y-1">
              <TreeNode node={fileTree} />
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500">
                <span className="font-medium">{stats.files} files</span> • 
                <span className="font-medium ml-1">{stats.folders} folders</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <TreePine className="mx-auto h-12 w-12 text-slate-300 mb-2" />
            <p>Upload a table file to see the structure preview</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
