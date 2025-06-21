import { useState, useRef, useCallback } from 'react';
import { CloudUpload, FileText, FolderOpen, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getFileNameWithoutExtension, isVpxFile } from '@/lib/file-utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploadZoneProps {
  onFileSelect: (file: File, tableName: string) => void;
  onTableNameChange: (newName: string) => void;
  tableName: string;
}

export default function FileUploadZone({ onFileSelect, onTableNameChange, tableName }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedName, setEditedName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const name = getFileNameWithoutExtension(file.name);
    onFileSelect(file, name);
    
    toast({
      title: "File loaded",
      description: `${name} has been loaded successfully`
    });
  }, [onFileSelect, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  const handleEditClick = useCallback(() => {
    setEditedName(tableName);
    setIsEditDialogOpen(true);
  }, [tableName]);

  const handleSaveEdit = useCallback(() => {
    if (editedName.trim() && editedName !== tableName) {
      onTableNameChange(editedName.trim());
      toast({
        title: "Table name updated",
        description: `Name changed to "${editedName.trim()}"`
      });
    }
    setIsEditDialogOpen(false);
  }, [editedName, tableName, onTableNameChange, toast]);

  const handleCancelEdit = useCallback(() => {
    setEditedName('');
    setIsEditDialogOpen(false);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CloudUpload className="text-primary mr-2 h-5 w-5" />
          File Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragOver
              ? 'border-primary bg-primary/5'
              : 'border-slate-300 bg-slate-50 hover:border-primary/50 hover:bg-primary/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CloudUpload className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <p className="text-lg font-medium text-slate-700 mb-2">
            Drag & drop your file here
          </p>
          <p className="text-sm text-slate-500 mb-4">
            or click to browse files
          </p>
          <Button>
            <FolderOpen className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".vpx,.vpt,.fp"
            onChange={handleInputChange}
          />
        </div>

        {tableName && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="text-green-600 mr-3 h-5 w-5" />
                <div>
                  <p className="font-medium text-green-900">File loaded:</p>
                  <p className="text-green-700">{tableName}</p>
                </div>
              </div>
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditClick}
                    className="text-green-600 hover:text-green-700 hover:bg-green-100"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Table Name</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="table-name">Table Name</Label>
                      <Input
                        id="table-name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        placeholder="Enter table name"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit();
                          } else if (e.key === 'Escape') {
                            handleCancelEdit();
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveEdit}>
                      Save
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
