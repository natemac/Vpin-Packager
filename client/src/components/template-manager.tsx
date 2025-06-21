import { useRef, useCallback } from 'react';
import { Download, Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationTemplate } from '@/types/organization';
import { readJsonFile, downloadJson } from '@/lib/file-utils';
import { useToast } from '@/hooks/use-toast';

interface TemplateManagerProps {
  onLoadTemplate: (template: OrganizationTemplate) => void;
  onSaveTemplate: () => OrganizationTemplate;
}

export default function TemplateManager({ onLoadTemplate, onSaveTemplate }: TemplateManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleLoadTemplate = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const template = await readJsonFile(file);
      
      // Validate template structure
      if (!template.name || !template.items || !Array.isArray(template.items)) {
        throw new Error('Invalid template format');
      }

      onLoadTemplate(template);
      toast({
        title: "Template loaded",
        description: `${template.name} has been loaded successfully`
      });
    } catch (error) {
      toast({
        title: "Error loading template",
        description: error instanceof Error ? error.message : "Failed to load template",
        variant: "destructive"
      });
    }

    // Reset file input
    e.target.value = '';
  }, [onLoadTemplate, toast]);

  const handleSaveTemplate = useCallback(() => {
    try {
      const template = onSaveTemplate();
      const fileName = `${template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.json`;
      downloadJson(template, fileName);
      
      toast({
        title: "Template saved",
        description: "Template has been downloaded successfully"
      });
    } catch (error) {
      toast({
        title: "Error saving template",
        description: "Failed to save template",
        variant: "destructive"
      });
    }
  }, [onSaveTemplate, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="text-primary mr-2 h-5 w-5" />
          Template Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            onClick={handleLoadTemplate}
            className="h-12"
          >
            <Download className="mr-2 h-4 w-4" />
            Load Template
          </Button>
          
          <Button 
            onClick={handleSaveTemplate}
            className="h-12"
          >
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
      </CardContent>
    </Card>
  );
}
