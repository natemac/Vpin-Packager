import { useState, useEffect } from "react";
import { Package, Folder, File, Files, Edit2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HelpIcon } from "@/components/ui/help-icon";
import { PINBALL_PRESETS, PresetItem, PresetCategory, DEFAULT_TABLE_LOCATION } from "@/lib/pinball-presets";
import { OrganizationItem } from "@/types/organization";
import { nanoid } from "nanoid";

interface PresetItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tableName: string;
  onAddPresetItems: (items: OrganizationItem[]) => void;
  tableLocation?: string;
  onTableLocationChange?: (location: string) => void;
  onTableNameChange?: (name: string) => void;
}

export default function PresetItemsDialog({
  open,
  onOpenChange,
  tableName,
  onAddPresetItems,
  tableLocation = DEFAULT_TABLE_LOCATION,
  onTableLocationChange,
  onTableNameChange
}: PresetItemsDialogProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [parentPaths, setParentPaths] = useState<Record<string, string>>({});
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [currentTableLocation, setCurrentTableLocation] = useState(DEFAULT_TABLE_LOCATION);
  const [currentTableName, setCurrentTableName] = useState(tableName);

  // Initialize parent paths and table name when dialog opens
  useEffect(() => {
    if (open) {
      const initialPaths: Record<string, string> = {};
      PINBALL_PRESETS.forEach(category => {
        initialPaths[category.name] = category.parentPath;
      });
      setParentPaths(initialPaths);
      setCurrentTableLocation(DEFAULT_TABLE_LOCATION);
      setCurrentTableName(tableName);
    }
  }, [open, tableName]);

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

  const handlePathEdit = (categoryName: string, newPath: string) => {
    setParentPaths(prev => ({
      ...prev,
      [categoryName]: newPath
    }));
  };

  const handleAddItems = () => {
    // Update the table location if callback is provided
    if (onTableLocationChange) {
      onTableLocationChange(currentTableLocation);
    }

    const itemsToAdd: OrganizationItem[] = [];

    selectedItems.forEach(itemId => {
      const category = PINBALL_PRESETS.find(cat => 
        cat.items.some(item => item.id === itemId)
      );
      const presetItem = category?.items.find(item => item.id === itemId);

      if (presetItem && category) {
        const parentPath = parentPaths[category.name] || category.parentPath;
        const fullLocation = parentPath + presetItem.defaultLocation;

        const organizationItem: OrganizationItem = {
          id: nanoid(),
          type: presetItem.type,
          label: presetItem.label,
          location: fullLocation,
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
    return (
      <Badge variant="outline" className="text-xs bg-white">
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
            <HelpIcon helpKey="preset-items" className="ml-2" />
          </DialogTitle>
          <DialogDescription>(Optional) Add Pre-configured Items below.</DialogDescription>
        </DialogHeader>

        {/* Table Name and Location Inputs */}
        <div className="border-b pb-4 mb-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table-name" className="text-sm font-medium">
              Table Name
            </Label>
            <Input
              id="table-name"
              value={currentTableName}
              onChange={(e) => {
                setCurrentTableName(e.target.value);
                onTableNameChange?.(e.target.value);
              }}
              placeholder="Enter table name"
              className="text-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="table-location" className="text-sm font-medium">
              Table Location
            </Label>
            <Input
              id="table-location"
              value={currentTableLocation}
              onChange={(e) => setCurrentTableLocation(e.target.value)}
              placeholder={DEFAULT_TABLE_LOCATION}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {PINBALL_PRESETS.map((category) => {
            const categoryItemIds = category.items.map(item => item.id);
            const selectedInCategory = categoryItemIds.filter(id => selectedItems.has(id)).length;
            const allSelected = selectedInCategory === categoryItemIds.length;
            const someSelected = selectedInCategory > 0 && selectedInCategory < categoryItemIds.length;

            return (
              <div key={category.name} className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold" style={{ color: 'var(--section-heading)' }}>{category.name}</h3>
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

                  {/* Editable Parent Path */}
                  <div className="flex items-center space-x-2">
                    {editingPath === category.name ? (
                      <>
                        <Input
                          value={parentPaths[category.name] || category.parentPath}
                          onChange={(e) => handlePathEdit(category.name, e.target.value)}
                          className="text-sm font-mono"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingPath(null);
                            }
                          }}
                          onBlur={() => setEditingPath(null)}
                          autoFocus
                        />
                      </>
                    ) : (
                      <>
                        <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {parentPaths[category.name] || category.parentPath}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPath(category.name)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {category.items.map((item) => {
                    const isSelected = selectedItems.has(item.id);

                    return (
                      <div
                        key={item.id}
                        className={`
                          border rounded-lg p-3 cursor-pointer transition-all duration-200
                          ${isSelected 
                            ? 'border-primary bg-primary/5 shadow-sm' 
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }
                        `}
                        onClick={() => handleItemToggle(item.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleItemToggle(item.id)}
                            />
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(item.type)}
                              <span className="font-medium text-sm" style={{ color: 'var(--item-label)' }}>{item.label}</span>
                            </div>
                          </div>
                          {getTypeBadge(item.type)}
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
          <div className="text-sm" style={{ color: 'var(--item-count)' }}>
            {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddItems}
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}