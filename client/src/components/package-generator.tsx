import { useState } from 'react';
import { Download, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { OrganizationItem } from '@/types/organization';
import { generateZipFromOrganization, calculatePackageSummary } from '@/lib/zip-generator';
import { formatFileSize, downloadBlob } from '@/lib/file-utils';
import { useToast } from '@/hooks/use-toast';

interface PackageGeneratorProps {
  items: OrganizationItem[];
  tableName: string;
  includeTable?: boolean;
  onIncludeTableChange?: (include: boolean) => void;
}

export default function PackageGenerator({ 
  items, 
  tableName, 
  includeTable = true, 
  onIncludeTableChange 
}: PackageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  // Calculate summary based on includeTable setting
  const itemsToSummarize = includeTable ? items : items.slice(1);
  const summary = calculatePackageSummary(itemsToSummarize);
  const hasFiles = items.some(item => item.files && item.files.length > 0);
  const canGenerate = tableName && hasFiles;

  const handleGeneratePackage = async () => {
    if (!canGenerate) {
      toast({
        title: "Cannot generate package",
        description: "Please upload a table file and add some files to organize",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    try {
      // Filter items based on includeTable setting
      const itemsToInclude = includeTable ? items : items.slice(1);
      
      const zipBlob = await generateZipFromOrganization(
        itemsToInclude,
        tableName,
        (progressPercent) => setProgress(progressPercent)
      );

      const fileName = `${tableName}.zip`;
      downloadBlob(zipBlob, fileName);

      toast({
        title: "Package generated successfully",
        description: `${fileName} has been downloaded`
      });
    } catch (error) {
      toast({
        title: "Error generating package",
        description: error instanceof Error ? error.message : "Failed to generate package",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Archive className="text-primary mr-2 h-5 w-5" />
          Generate Package
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Package Summary */}
        <div className="bg-slate-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500">Total Files:</span>
              <span className="font-semibold text-slate-900 ml-2">{summary.fileCount}</span>
            </div>
            <div>
              <span className="text-slate-500">Est. Size:</span>
              <span className="font-semibold text-slate-900 ml-2">
                {formatFileSize(summary.totalSize)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Folders:</span>
              <span className="font-semibold text-slate-900 ml-2">{summary.folderCount}</span>
            </div>
            <div>
              <span className="text-slate-500">Format:</span>
              <span className="font-semibold text-slate-900 ml-2">ZIP</span>
            </div>
          </div>
        </div>

        {/* Package Options */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="include-table"
              checked={includeTable}
              onCheckedChange={(checked) => onIncludeTableChange?.(checked as boolean)}
            />
            <Label htmlFor="include-table" className="text-sm font-medium">
              Include Table in Package
            </Label>
          </div>
        </div>

        {/* Generate Button */}
        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={handleGeneratePackage}
          disabled={!canGenerate || isGenerating}
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generating...' : 'Generate Package'}
        </Button>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-slate-600 mb-2">
              <span>Generating package...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {!canGenerate && (
          <p className="text-sm text-slate-500 mt-2 text-center">
            {!tableName ? 'Upload a table file first' : 'Add files to organize'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
