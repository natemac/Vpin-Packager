import { useState, useRef, useCallback } from 'react';
import { Plus, Trash2, File, Files, Folder, ChevronDown, Edit3, Upload, MousePointer, Package } from 'lucide-react';
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
  onShowPresetDialog?: () => void;
}

export default function OrganizationBuilder({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onRemoveItem,
  tableName,
  onTableNameChange,
  onShowPresetDialog
}: OrganizationBuilderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (itemId: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    onUpdateItem(itemId, { files: fileArray });
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, item: OrganizationItem) => {
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      onUpdateItem(item.id, { files: fileArray });
    }
  }, [onUpdateItem]);

  const handleCardClick = useCallback((item: OrganizationItem) => {
    // Create a temporary file input for this specific item
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = item.type !== 'single';
    if (item.type === 'folder') {
      input.webkitdirectory = true;
    }
    
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        onUpdateItem(item.id, { files: fileArray });
      }
    };
    
    input.click();
  }, [onUpdateItem]);

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
    
    // Convert existing files array back to FileList-like structure for the dialog
    let fileList = null;
    if (item.files && item.files.length > 0) {
      const dt = new DataTransfer();
      item.files.forEach(file => dt.items.add(file));
      fileList = dt.files;
    }
    
    setDialogData({
      label: item.label,
      location: item.location,
      files: fileList,
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
            <div 
              key={item.id} 
              className="group relative flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all duration-200 cursor-pointer hover:border-blue-300 hover:shadow-sm"
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, item)}
              onClick={(e) => {
                // Don't trigger file selection if clicking on buttons
                if ((e.target as HTMLElement).closest('button')) return;
                handleCardClick(item);
              }}
            >

              
              <div className="flex items-center space-x-3 relative z-10">
                {getItemIcon(item.type)}
                <div className="flex-1">
                  <div className="font-medium text-slate-700 flex items-center">
                    {item.label || getItemTypeName(item.type)}
                    {item.files && item.files.length > 0 && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.files.length} file{item.files.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {item.location && `${item.location} • `}
                    {item.files?.length || 0} {item.type === 'folder' ? 'items' : 'files'}
                    {!item.files || item.files.length === 0 && (
                      <span className="text-amber-600"> • Click or drag files here</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 relative z-10">
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
              {onShowPresetDialog && (
                <button
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-100 flex items-center"
                  onClick={() => {
                    setDropdownOpen(false);
                    onShowPresetDialog();
                  }}
                >
                  <Package className="text-purple-600 mr-3 h-4 w-4" />
                  <span className="font-medium">Add Preset Items</span>
                </button>
              )}
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
                <Label htmlFor="dialog-label">
                  {dialogType === 'folder' ? 'Folder Name' : 'Label'}
                </Label>
                <Input
                  id="dialog-label"
                  value={dialogData.label}
                  onChange={(e) => setDialogData(prev => ({ ...prev, label: e.target.value }))}
                  placeholder={dialogType === 'folder' 
                    ? (dialogData.renameFolder ? 'Enter new folder name' : 'Original folder name will be used')
                    : (dialogType ? getItemTypeName(dialogType) : '')
                  }
                  disabled={dialogType === 'folder' && !dialogData.renameFolder}
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
                <div className="flex items-center">
                  <input
                    ref={fileInputRef}
                    id="dialog-files"
                    type="file"
                    multiple={dialogType !== 'single'}
                    {...(dialogType === 'folder' ? { webkitdirectory: '' } : {})}
                    onChange={(e) => setDialogData(prev => ({ ...prev, files: e.target.files }))}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mr-3"
                  >
                    Browse...
                  </Button>
                  <span className="text-sm text-slate-500">
                    {dialogData.files && dialogData.files.length > 0 
                      ? (dialogType === 'folder' 
                          ? (() => {
                              const firstFile = Array.from(dialogData.files)[0];
                              if (firstFile && 'webkitRelativePath' in firstFile && firstFile.webkitRelativePath) {
                                const folderName = firstFile.webkitRelativePath.split('/')[0];
                                return `1 folder selected: ${folderName}`;
                              }
                              return `${dialogData.files.length} file${dialogData.files.length !== 1 ? 's' : ''} selected`;
                            })()
                          : `${dialogData.files.length} file${dialogData.files.length !== 1 ? 's' : ''} selected: ${Array.from(dialogData.files).map(f => f.name).join(', ')}`)
                      : 'No file selected.'}
                  </span>
                </div>
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
                      onCheckedChange={(checked) => {
                        const newChecked = checked as boolean;
                        setDialogData(prev => {
                          // Clear label when unchecking, populate when checking
                          let newLabel = prev.label;
                          if (!newChecked) {
                            newLabel = '';
                          } else if (prev.files && prev.files.length > 0) {
                            // Try to get original folder name as starting point
                            const firstFile = Array.from(prev.files)[0];
                            if (firstFile && 'webkitRelativePath' in firstFile && firstFile.webkitRelativePath) {
                              const folderName = firstFile.webkitRelativePath.split('/')[0];
                              newLabel = folderName;
                            }
                          }
                          return { ...prev, renameFolder: newChecked, label: newLabel };
                        });
                      }}
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
