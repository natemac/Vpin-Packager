import { useState, useRef, useCallback } from 'react';
import { CloudUpload, FileText, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFileNameWithoutExtension, isVpxFile } from '@/lib/file-utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploadZoneProps {
  onFileSelect: (file: File, tableName: string) => void;
  tableName: string;
}

export default function FileUploadZone({ onFileSelect, tableName }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Add file size check (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 100MB",
        variant: "destructive"
      });
      return;
    }

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
          <p className="text-sm text-slate-500">
            or click to browse files
          </p>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleInputChange}
            accept=".vpx,.vpt,.fp,*"
          />
        </div>

        {tableName && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <FileText className="text-green-600 mr-3 h-5 w-5" />
              <div>
                <p className="font-medium text-green-900">File loaded:</p>
                <p className="text-green-700">{tableName}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
