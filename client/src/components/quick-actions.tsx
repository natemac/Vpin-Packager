import { useRef, useCallback, useState } from 'react';
import { Zap, Eraser, Download, Save, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpIcon } from '@/components/ui/help-icon';
import { OrganizationTemplate } from '@/types/organization';
import { readJsonFile, downloadJson } from '@/lib/file-utils';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  onLoadTemplate: (template: OrganizationTemplate) => void;
  onSaveTemplate: () => OrganizationTemplate;
  onClearInterface: () => void;
}

export default function QuickActions({ onLoadTemplate, onSaveTemplate, onClearInterface }: QuickActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');



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
    setTemplateName('');
    setShowSaveDialog(true);
  }, []);

  const handleConfirmSave = useCallback(() => {
    if (!templateName.trim()) {
      toast({
        title: "Template name required",
        description: "Please enter a name for your template",
        variant: "destructive"
      });
      return;
    }

    try {
      const template = onSaveTemplate();
      // Update template with user-provided name
      const updatedTemplate = {
        ...template,
        name: templateName.trim()
      };
      
      const fileName = `${templateName.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase()}_template.json`;
      downloadJson(updatedTemplate, fileName);
      
      toast({
        title: "Template saved",
        description: `${templateName} has been downloaded successfully`
      });
      
      setShowSaveDialog(false);
      setTemplateName('');
    } catch (error) {
      toast({
        title: "Error saving template",
        description: "Failed to save template",
        variant: "destructive"
      });
    }
  }, [templateName, onSaveTemplate, toast]);

  const handleClearInterface = () => {
    if (confirm('Are you sure you want to clear the interface? This will remove all current organization items.')) {
      onClearInterface();
      toast({
        title: "Interface cleared",
        description: "All organization items have been removed"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="text-primary mr-2 h-5 w-5" />
          Item Tools
          <HelpIcon helpKey="quick-actions" className="ml-2" />
        </CardTitle>
        <p className="text-sm text-slate-500 mt-1">Load & Save item collections and file locations.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Template Management */}
          <div>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={handleLoadTemplate}
                className="w-full h-10 text-sm justify-start"
              >
                <Download className="mr-2 h-4 w-4" />
                Load Template
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleSaveTemplate}
                className="w-full h-10 text-sm justify-start"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Template
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start h-auto p-3 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                onClick={handleClearInterface}
              >
                <Eraser className="mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Clear Interface</span>
              </Button>
            </div>
          </div>

          {/* External Resources */}
          <div className="pt-3 border-t border-slate-200">
            <Button 
              variant="outline" 
              onClick={() => window.open('https://express.adobe.com/user-template/urn:aaid:sc:US:f0a0b791-ee5a-4702-9b15-c827bc53fdcf/4f36446b-9956-4b5e-9dc3-5568a1480729?isBrand=false', '_blank')}
              className="w-full h-10 text-sm justify-start"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Marquee Backglass Video
            </Button>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".json"
          onChange={handleFileChange}
        />
      </CardContent>
      {/* Save Template Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Template</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="template-name" className="text-sm font-medium">
              Template Name
            </Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name"
              className="mt-2"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleConfirmSave();
                }
              }}
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowSaveDialog(false);
                setTemplateName('');
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmSave}>
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
