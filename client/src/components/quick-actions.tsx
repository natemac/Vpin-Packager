import { Zap, Gamepad, Monitor, Eraser } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrganizationTemplate } from '@/types/organization';
import { BUILTIN_TEMPLATES } from '@/lib/templates';
import { useToast } from '@/hooks/use-toast';

interface QuickActionsProps {
  onLoadTemplate: (template: OrganizationTemplate) => void;
  onClearInterface: () => void;
}

export default function QuickActions({ onLoadTemplate, onClearInterface }: QuickActionsProps) {
  const { toast } = useToast();

  const handleLoadBuiltinTemplate = (templateKey: string) => {
    const template = BUILTIN_TEMPLATES[templateKey];
    if (template) {
      onLoadTemplate(template);
      toast({
        title: "Template loaded",
        description: `${template.name} has been loaded successfully`
      });
    }
  };

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
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Built-in Templates */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-2">Built-in Templates</h3>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleLoadBuiltinTemplate('pinballEmporium')}
              >
                <Gamepad className="text-blue-600 mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Pinball Emporium</span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full justify-start h-auto p-3"
                onClick={() => handleLoadBuiltinTemplate('pinupPopper')}
              >
                <Monitor className="text-green-600 mr-2 h-4 w-4" />
                <span className="text-sm font-medium">Pinup Popper</span>
              </Button>
            </div>
          </div>

          {/* Interface Actions */}
          <div className="pt-3 border-t border-slate-200">
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
      </CardContent>
    </Card>
  );
}
