import { useState, useRef } from 'react';
import { Plus, Trash2, File, Files, Folder, ChevronDown, Edit3, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OrganizationItem } from '@/types/organization';
import { isImageFile } from '@/lib/file-utils';

interface OrganizationBuilderProps {
  items: OrganizationItem[];
  onAddItem: (type: 'single' | 'multiple' | 'folder') => void;
  onUpdateItem: (id: string, updates: Partial<OrganizationItem>) => void;
  onRemoveItem: (id: string) => void;
  tableName: string;
  onTableNameChange: (name: string) => void;
}

export default function OrganizationBuilder({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem,
  tableName,
  onTableNameChange
}: OrganizationBuilderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingLabels, setEditingLabels] = useState<{ [key: string]: boolean }>({});
  const [editingValues, setEditingValues] = useState<{ [key: string]: string }>({});

  const handleFileSelect = (itemId: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    onUpdateItem(itemId, { files: fileArray });
  };

  const startEditingLabel = (itemId: string, currentLabel: string) => {
    setEditingLabels(prev => ({ ...prev, [itemId]: true }));
    setEditingValues(prev => ({ ...prev, [itemId]: currentLabel }));
  };

  const saveLabel = (itemId: string) => {
    const newLabel = editingValues[itemId] || '';
    onUpdateItem(itemId, { label: newLabel });
    setEditingLabels(prev => ({ ...prev, [itemId]: false }));
    setEditingValues(prev => ({ ...prev, [itemId]: '' }));
  };

  const cancelEditingLabel = (itemId: string) => {
    setEditingLabels(prev => ({ ...prev, [itemId]: false }));
    setEditingValues(prev => ({ ...prev, [itemId]: '' }));
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
        {/* Table Information Section */}
        {items.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Table Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="table-name" className="text-sm font-medium text-blue-800">
                  Table Name
                </Label>
                <Input
                  id="table-name"
                  value={tableName}
                  onChange={(e) => onTableNameChange(e.target.value)}
                  placeholder="Enter table name"
                  className="mt-1 bg-white"
                />
              </div>
              <div>
                <Label htmlFor="table-location" className="text-sm font-medium text-blue-800">
                  File Location
                </Label>
                <Input
                  id="table-location"
                  value={items[0]?.location || ''}
                  onChange={(e) => onUpdateItem(items[0]?.id || '', { location: e.target.value })}
                  placeholder="tables/"
                  className="mt-1 bg-white"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {items.slice(1).map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  {getItemIcon(item.type)}
                  <div className="flex items-center ml-2">
                    {editingLabels[item.id] ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingValues[item.id]}
                          onChange={(e) => setEditingValues(prev => ({ ...prev, [item.id]: e.target.value }))}
                          className="text-sm h-7 w-32"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveLabel(item.id);
                            if (e.key === 'Escape') cancelEditingLabel(item.id);
                          }}
                          autoFocus
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => saveLabel(item.id)}
                          className="h-7 w-7 p-0 text-green-600 hover:text-green-700"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelEditingLabel(item.id)}
                          className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="font-medium text-slate-700">
                          {item.label || getItemTypeName(item.type)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditingLabel(item.id, item.label || getItemTypeName(item.type))}
                          className="ml-1 h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
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

              {/* File Location and File Selection */}
              <div className="grid grid-cols-2 gap-4 mb-3">
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
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-2 block">
                    {item.type === 'folder' ? 'Folder' : 'Files'} ({item.files?.length || 0} selected)
                  </Label>
                  <input
                    type="file"
                    multiple={item.type !== 'single'}
                    {...(item.type === 'folder' ? { webkitdirectory: '' } : {})}
                    onChange={(e) => handleFileSelect(item.id, e.target.files)}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>
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
                  <div className="space-y-2">
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
                    
                    {item.options.convertToPng && (
                      <div className="ml-6">
                        <Label className="text-sm text-slate-600 mb-1 block">
                          Compression Level
                        </Label>
                        <Select
                          value={item.options.pngCompressionLevel || 'low'}
                          onValueChange={(value: 'none' | 'low' | 'high') =>
                            onUpdateItem(item.id, {
                              options: { ...item.options, pngCompressionLevel: value }
                            })
                          }
                        >
                          <SelectTrigger className="w-32 h-8 text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
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
