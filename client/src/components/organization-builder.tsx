import { useState, useRef } from 'react';
import { Plus, Trash2, File, Files, Folder, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { OrganizationItem } from '@/types/organization';
import { isImageFile } from '@/lib/file-utils';

interface OrganizationBuilderProps {
  items: OrganizationItem[];
  onAddItem: (type: 'single' | 'multiple' | 'folder') => void;
  onUpdateItem: (id: string, updates: Partial<OrganizationItem>) => void;
  onRemoveItem: (id: string) => void;
}

export default function OrganizationBuilder({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem 
}: OrganizationBuilderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleFileSelect = (itemId: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    onUpdateItem(itemId, { files: fileArray });
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'single': return <File className="text-blue-600 h-4 w-4" />;
      case 'multiple': return <Files className="text-green-600 h-4 w-4" />;
      case 'folder': return <Folder className="text-yellow-600 h-4 w-4" />;
      default: return <File className="text-blue-600 h-4 w-4" />;
    }
  };

  const getItemTypeName = (type: string) => {
    switch (type) {
      case 'single': return 'Single File';
      case 'multiple': return 'Multiple Files';
      case 'folder': return 'Folder';
      default: return 'Unknown';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="text-primary mr-2 h-5 w-5" />
          File Organization Structure
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {getItemIcon(item.type)}
                  <span className="font-medium text-slate-700 ml-2">
                    {getItemTypeName(item.type)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <Label htmlFor={`label-${item.id}`} className="text-sm font-medium text-slate-700">
                    Label
                  </Label>
                  <Input
                    id={`label-${item.id}`}
                    value={item.label}
                    onChange={(e) => onUpdateItem(item.id, { label: e.target.value })}
                    placeholder="Enter label"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor={`location-${item.id}`} className="text-sm font-medium text-slate-700">
                    File Location
                  </Label>
                  <Input
                    id={`location-${item.id}`}
                    value={item.location}
                    onChange={(e) => onUpdateItem(item.id, { location: e.target.value })}
                    placeholder="folder/"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* File Selection */}
              <div className="mb-3">
                <Label className="text-sm font-medium text-slate-700 mb-2 block">
                  Files ({item.files?.length || 0} selected)
                </Label>
                <input
                  type="file"
                  multiple={item.type !== 'single'}
                  onChange={(e) => handleFileSelect(item.id, e.target.files)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                />
              </div>

              {/* Options */}
              <div className="space-y-2">
                {item.type === 'single' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`table-name-${item.id}`}
                      checked={item.options.useTableName || false}
                      onCheckedChange={(checked) => 
                        onUpdateItem(item.id, { 
                          options: { ...item.options, useTableName: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor={`table-name-${item.id}`} className="text-sm text-slate-600">
                      Use table name as filename
                    </Label>
                  </div>
                )}

                {item.files && item.files.some(file => isImageFile(file.name)) && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`convert-png-${item.id}`}
                      checked={item.options.convertToPng || false}
                      onCheckedChange={(checked) => 
                        onUpdateItem(item.id, { 
                          options: { ...item.options, convertToPng: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor={`convert-png-${item.id}`} className="text-sm text-slate-600">
                      Convert images to PNG
                    </Label>
                  </div>
                )}

                {item.type === 'folder' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`rename-folder-${item.id}`}
                      checked={item.options.renameFolder || false}
                      onCheckedChange={(checked) => 
                        onUpdateItem(item.id, { 
                          options: { ...item.options, renameFolder: checked as boolean }
                        })
                      }
                    />
                    <Label htmlFor={`rename-folder-${item.id}`} className="text-sm text-slate-600">
                      Rename folder
                    </Label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Item Button & Dropdown */}
        <div className="relative">
          <Button
            className="w-full"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Item
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>

          {dropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
              <button
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 flex items-center"
                onClick={() => {
                  onAddItem('single');
                  setDropdownOpen(false);
                }}
              >
                <File className="text-blue-600 mr-3 h-4 w-4" />
                <span className="font-medium">Single File</span>
              </button>
              <button
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 flex items-center"
                onClick={() => {
                  onAddItem('multiple');
                  setDropdownOpen(false);
                }}
              >
                <Files className="text-green-600 mr-3 h-4 w-4" />
                <span className="font-medium">Multiple Files</span>
              </button>
              <button
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center"
                onClick={() => {
                  onAddItem('folder');
                  setDropdownOpen(false);
                }}
              >
                <Folder className="text-yellow-600 mr-3 h-4 w-4" />
                <span className="font-medium">Folder</span>
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
