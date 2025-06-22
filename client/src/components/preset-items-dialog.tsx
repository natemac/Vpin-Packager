import { useState } from "react";
import { Check, Package, Folder, File, Files } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PINBALL_PRESETS, PresetItem, PresetCategory } from "@/lib/pinball-presets";
import { OrganizationItem } from "@/types/organization";
import { nanoid } from "nanoid";

interface PresetItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableName: string;
  onAddPresetItems: (items: OrganizationItem[]) => void;
}

export default function PresetItemsDialog({
  open,
  onOpenChange,
  tableName,
  onAddPresetItems
}: PresetItemsDialogProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleItemToggle = (itemId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const handleSelectAll = (category: PresetCategory) => {
    const categoryItemIds = category.items.map(item => item.id);
    const newSelection = new Set(selectedItems);
    const allSelected = categoryItemIds.every(id => newSelection.has(id));
    
    if (allSelected) {
      // Deselect all items in this category
      categoryItemIds.forEach(id => newSelection.delete(id));
    } else {
      // Select all items in this category
      categoryItemIds.forEach(id => newSelection.add(id));
    }
    setSelectedItems(newSelection);
  };

  const handleAddItems = () => {
    const itemsToAdd: OrganizationItem[] = [];
    
    selectedItems.forEach(itemId => {
      const presetItem = PINBALL_PRESETS
        .flatMap(category => category.items)
        .find(item => item.id === itemId);
      
      if (presetItem) {
        const organizationItem: OrganizationItem = {
          id: nanoid(),
          type: presetItem.type,
          label: presetItem.label,
          location: presetItem.defaultLocation,
          options: {
            useTableName: presetItem.useTableName,
            convertToPng: false,
            pngCompressionLevel: 'low',
            renameFolder: false
          },
          files: []
        };
        itemsToAdd.push(organizationItem);
      }
    });

    onAddPresetItems(itemsToAdd);
    setSelectedItems(new Set());
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedItems(new Set());
    onOpenChange(false);
  };

  const getTypeIcon = (type: PresetItem['type']) => {
    switch (type) {
      case 'single':
        return <File className="h-4 w-4" />;
      case 'multiple':
        return <Files className="h-4 w-4" />;
      case 'folder':
        return <Folder className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: PresetItem['type']) => {
    const variants = {
      single: 'default',
      multiple: 'secondary',
      folder: 'outline'
    } as const;
    
    return (
      <Badge variant={variants[type]} className="text-xs">
        {type}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="mr-2 h-5 w-5 text-primary" />
            Add Preset Items for "{tableName}"
          </DialogTitle>
          <DialogDescription>
            Select the items you'd like to add to your file organization. These are pre-configured with common locations and settings.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {PINBALL_PRESETS.map((category) => {
            const categoryItemIds = category.items.map(item => item.id);
            const selectedInCategory = categoryItemIds.filter(id => selectedItems.has(id)).length;
            const allSelected = selectedInCategory === categoryItemIds.length;
            const someSelected = selectedInCategory > 0 && selectedInCategory < categoryItemIds.length;

            return (
              <div key={category.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{category.name}</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSelectAll(category)}
                    className="text-xs"
                  >
                    {allSelected ? 'Deselect All' : 'Select All'}
                    {someSelected && !allSelected && ` (${selectedInCategory})`}
                  </Button>
                </div>

                <div className="grid gap-3">
                  {category.items.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    
                    return (
                      <div
                        key={item.id}
                        className={`
                          border rounded-lg p-4 cursor-pointer transition-all duration-200
                          ${isSelected 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }
                        `}
                        onClick={() => handleItemToggle(item.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleItemToggle(item.id)}
                              className="mt-1"
                            />
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(item.type)}
                              <span className="font-medium text-slate-900">{item.label}</span>
                            </div>
                          </div>
                          {getTypeBadge(item.type)}
                        </div>

                        <div className="ml-8 mt-2 space-y-1">
                          <div className="text-sm text-slate-600">
                            <span className="font-medium">Location:</span> {item.defaultLocation}
                          </div>
                          {item.useTableName && (
                            <div className="text-sm text-blue-600">
                              <Check className="inline h-3 w-3 mr-1" />
                              Uses table name
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {category !== PINBALL_PRESETS[PINBALL_PRESETS.length - 1] && (
                  <Separator className="my-6" />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-slate-600">
            {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddItems}
              disabled={selectedItems.size === 0}
            >
              Add Selected Items
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}