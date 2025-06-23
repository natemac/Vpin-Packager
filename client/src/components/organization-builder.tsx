import { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, File, Files, Folder, ChevronDown, Edit3, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { OrganizationItem } from '@/types/organization';
import { isImageFile } from '@/lib/file-utils';

interface OrganizationBuilderProps {
  items: OrganizationItem[];
  onAddItem: (type: 'single' | 'multiple' | 'folder', itemData?: Partial<OrganizationItem>) => void;
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
  const [dragOverItem, setDragOverItem] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'single' | 'multiple' | 'folder' | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [dialogData, setDialogData] = useState({
    label: '',
    location: '',
    files: null as FileList | null,
    useTableName: false,
    convertToPng: false,
    pngCompressionLevel: 'low' as 'none' | 'low' | 'high',
    renameFolder: false
  });

  const handleFileSelect = (itemId: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    onUpdateItem(itemId, { files: fileArray });
  };

  const handleDragOver = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setDragOverItem(itemId);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    // Only clear if leaving the entire card area
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverItem(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    setDragOverItem(null);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(itemId, files);
    }
  }, [handleFileSelect]);

  const handleCardClick = useCallback((e: React.MouseEvent, itemId: string, item: OrganizationItem) => {
    // Don't trigger file browser if clicking on action buttons
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    
    const input = fileInputRefs.current[itemId];
    if (input) {
      input.click();
    }
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, itemId: string) => {
    handleFileSelect(itemId, e.target.files);
    // Reset the input to allow re-selecting the same files
    e.target.value = '';
  }, []);

  const openAddDialog = (type: 'single' | 'multiple' | 'folder') => {
    setDialogType(type);
    setEditingItem(null);
    setDialogData({
      label: getItemTypeName(type),
      location: '',
      files: null,
      useTableName: false,
      convertToPng: false,
      pngCompressionLevel: 'low',
      renameFolder: false
    });
    setDialogOpen(true);
    setDropdownOpen(false);
  };

  const openEditDialog = (item: OrganizationItem) => {
    setDialogType(item.type);
    setEditingItem(item.id);
    setDialogData({
      label: item.label,
      location: item.location,
      files: null,
      useTableName: item.options.useTableName || false,
      convertToPng: item.options.convertToPng || false,
      pngCompressionLevel: item.options.pngCompressionLevel || 'low',
      renameFolder: item.options.renameFolder || false
    });
    setDialogOpen(true);
  };

  const handleDialogSave = () => {
    if (!dialogType) return;

    if (editingItem) {
      // Update existing item
      const updates: Partial<OrganizationItem> = {
        label: dialogData.label,
        location: dialogData.location,
        options: {
          useTableName: dialogData.useTableName,
          convertToPng: dialogData.convertToPng,
          pngCompressionLevel: dialogData.pngCompressionLevel,
          renameFolder: dialogData.renameFolder
        }
      };
      
      if (dialogData.files) {
        updates.files = Array.from(dialogData.files);
      }
      
      onUpdateItem(editingItem, updates);
    } else {
      // Add new item with all data
      const itemData: Partial<OrganizationItem> = {
        label: dialogData.label,
        location: dialogData.location,
        options: {
          useTableName: dialogData.useTableName,
          convertToPng: dialogData.convertToPng,
          pngCompressionLevel: dialogData.pngCompressionLevel,
          renameFolder: dialogData.renameFolder
        },
        files: dialogData.files ? Array.from(dialogData.files) : []
      };
      
      onAddItem(dialogType, itemData);
    }
    
    setDialogOpen(false);
  };

  const resetDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
    setEditingItem(null);
    setDialogData({
      label: '',
      location: '',
      files: null,
      useTableName: false,
      convertToPng: false,
      pngCompressionLevel: 'low',
      renameFolder: false
    });
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

        {/* Compact Item Cards */}
        <div className="space-y-3 mb-6">
          {items.slice(1).map((item) => (
            <div key={item.id} className="relative">
              {/* Hidden file input for each item */}
              <input
                ref={(el) => (fileInputRefs.current[item.id] = el)}
                type="file"
                multiple={item.type !== 'single'}
                {...(item.type === 'folder' ? { webkitdirectory: '' } : {})}
                onChange={(e) => handleFileInputChange(e, item.id)}
                className="hidden"
              />
              
              <div 
                className={`
                  flex items-center justify-between p-3 border rounded-lg bg-white transition-all cursor-pointer
                  ${dragOverItem === item.id 
                    ? 'border-primary bg-primary/5 shadow-md' 
                    : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }
                  ${!item.files?.length ? 'border-dashed' : ''}
                `}
                onClick={(e) => handleCardClick(e, item.id, item)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragLeave={(e) => handleDragLeave(e, item.id)}
                onDrop={(e) => handleDrop(e, item.id)}
              >
                <div className="flex items-center space-x-3">
                  {getItemIcon(item.type)}
                  <div>
                    <div className="font-medium text-slate-700">
                      {item.label || getItemTypeName(item.type)}
                    </div>
                    <div className="text-xs text-slate-500">
                      {item.location && `${item.location} • `}
                      {item.files?.length || 0} {item.type === 'folder' ? 'items' : 'files'}
                      {!item.files?.length && (
                        <span className="text-blue-500 ml-1">• Drop files or click to browse</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {!item.files?.length && (
                    <Upload className="h-4 w-4 text-slate-400" />
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(item);
                    }}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveItem(item.id);
                    }}
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
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
                onClick={() => openAddDialog('single')}
              >
                <File className="text-blue-600 mr-3 h-4 w-4" />
                <span className="font-medium">Single File</span>
              </button>
              <button
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 flex items-center"
                onClick={() => openAddDialog('multiple')}
              >
                <Files className="text-green-600 mr-3 h-4 w-4" />
                <span className="font-medium">Multiple Files</span>
              </button>
              <button
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center"
                onClick={() => openAddDialog('folder')}
              >
                <Folder className="text-yellow-600 mr-3 h-4 w-4" />
                <span className="font-medium">Folder</span>
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Item Dialog */}
        <Dialog open={dialogOpen} onOpenChange={resetDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit' : 'Add'} {dialogType && getItemTypeName(dialogType)}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Label */}
              <div>
                <Label htmlFor="dialog-label">Label</Label>
                <Input
                  id="dialog-label"
                  value={dialogData.label}
                  onChange={(e) => setDialogData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder={dialogType ? getItemTypeName(dialogType) : ''}
                />
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="dialog-location">File Location</Label>
                <Input
                  id="dialog-location"
                  value={dialogData.location}
                  onChange={(e) => setDialogData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="folder/"
                />
              </div>

              {/* File Selection */}
              <div>
                <Label htmlFor="dialog-files">
                  {dialogType === 'folder' ? 'Select Folder' : 'Select Files'}
                </Label>
                <input
                  id="dialog-files"
                  type="file"
                  multiple={dialogType !== 'single'}
                  {...(dialogType === 'folder' ? { webkitdirectory: '' } : {})}
                  onChange={(e) => setDialogData(prev => ({ ...prev, files: e.target.files }))}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                {dialogData.files && (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-slate-600">
                      {dialogData.files.length} {dialogType === 'folder' ? 'items' : 'files'} selected:
                    </p>
                    <div className="max-h-32 overflow-y-auto bg-slate-50 rounded-md p-2">
                      {Array.from(dialogData.files).map((file, index) => (
                        <div key={index} className="text-xs text-slate-700 py-1 flex items-center">
                          <File className="h-3 w-3 mr-2 text-slate-400" />
                          <span className="truncate">{file.name}</span>
                          <span className="ml-auto text-slate-500 text-xs">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <div className="space-y-3">
                {dialogType === 'single' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dialog-table-name"
                      checked={dialogData.useTableName}
                      onCheckedChange={(checked) => 
                        setDialogData(prev => ({ ...prev, useTableName: checked as boolean }))
                      }
                    />
                    <Label htmlFor="dialog-table-name">Use table name as filename</Label>
                  </div>
                )}

                {dialogData.files && Array.from(dialogData.files).some(file => isImageFile(file.name)) && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dialog-convert-png"
                        checked={dialogData.convertToPng}
                        onCheckedChange={(checked) => 
                          setDialogData(prev => ({ ...prev, convertToPng: checked as boolean }))
                        }
                      />
                      <Label htmlFor="dialog-convert-png">Convert images to PNG</Label>
                    </div>
                    
                    {dialogData.convertToPng && (
                      <div className="ml-6">
                        <Label className="text-sm text-slate-600 mb-1 block">
                          Compression Level
                        </Label>
                        <Select
                          value={dialogData.pngCompressionLevel}
                          onValueChange={(value: 'none' | 'low' | 'high') =>
                            setDialogData(prev => ({ ...prev, pngCompressionLevel: value }))
                          }
                        >
                          <SelectTrigger className="w-32">
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

                {dialogType === 'folder' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="dialog-rename-folder"
                      checked={dialogData.renameFolder}
                      onCheckedChange={(checked) => 
                        setDialogData(prev => ({ ...prev, renameFolder: checked as boolean }))
                      }
                    />
                    <Label htmlFor="dialog-rename-folder">Rename folder</Label>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={resetDialog}>
                Cancel
              </Button>
              <Button onClick={handleDialogSave}>
                {editingItem ? 'Update' : 'Add'} Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
