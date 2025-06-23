import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { useOrganization } from "@/hooks/use-organization";
import { OrganizationItem } from "@/types/organization";
import { DEFAULT_TABLE_LOCATION } from "@/lib/pinball-presets";
import FileUploadZone from "@/components/file-upload-zone";
import OrganizationBuilder from "@/components/organization-builder";
import FileTreePreview from "@/components/file-tree-preview";
import PackageGenerator from "@/components/package-generator";
import QuickActions from "@/components/quick-actions";
import PresetItemsDialog from "@/components/preset-items-dialog";

export default function FileOrganizer() {
  const organization = useOrganization();
  const [includeTable, setIncludeTable] = useState(true);
  const [showPresetDialog, setShowPresetDialog] = useState(false);
  const [pendingTableFile, setPendingTableFile] = useState<{file: File, name: string} | null>(null);

  const handleFileSelect = (file: File, name: string) => {
    // Set up the table file and name
    organization.setTableFile(file);
    organization.setTableName(name);
    organization.addFirstItem(file);
    
    // Store the file info and show preset dialog
    setPendingTableFile({ file, name });
    setShowPresetDialog(true);
  };

  const handleAddPresetItems = (presetItems: OrganizationItem[]) => {
    organization.addMultipleItems(presetItems);
    setPendingTableFile(null);
  };

  const handleTableLocationChange = (location: string) => {
    // Update the table location on the first item (table file)
    if (organization.items.length > 0) {
      organization.updateItem(organization.items[0].id, { location });
    }
  };

  const handlePresetDialogClose = () => {
    setShowPresetDialog(false);
    setPendingTableFile(null);
  };

  const handleShowPresetDialog = () => {
    // Set a default table name if none exists
    if (!organization.tableName) {
      setPendingTableFile({ file: new File([], 'table'), name: 'My Table' });
    }
    setShowPresetDialog(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
            <FolderOpen className="text-primary mr-3 h-6 w-6" />
            File Organizer Pro
            <span className="text-sm font-normal text-slate-500 ml-2">Package & rename files to easily add them to your cabinet.</span>
          </h1>
        </div>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column (2/3) */}
          <div className="col-span-8 space-y-6">
            <FileUploadZone 
              onFileSelect={handleFileSelect}
              tableName={organization.tableName}
            />
            
            <OrganizationBuilder 
              items={organization.items}
              onAddItem={organization.addItem}
              onUpdateItem={organization.updateItem}
              onRemoveItem={organization.removeItem}
              tableName={organization.tableName}
              onTableNameChange={organization.setTableName}
            />
          </div>

          {/* Right Column (1/3) */}
          <div className="col-span-4 space-y-6">
            <PackageGenerator 
              items={organization.items}
              tableName={organization.tableName}
              includeTable={includeTable}
              onIncludeTableChange={setIncludeTable}
            />
            
            <QuickActions 
              onLoadTemplate={organization.loadTemplate}
              onSaveTemplate={organization.exportTemplate}
              onClearInterface={organization.clearAll}
              onShowPresetDialog={handleShowPresetDialog}
            />
            
            <FileTreePreview 
              items={organization.items}
              tableName={organization.tableName}
              includeTable={includeTable}
            />
          </div>
        </div>
      </main>
      {/* Preset Items Dialog */}
      <PresetItemsDialog
        open={showPresetDialog}
        onOpenChange={setShowPresetDialog}
        tableName={pendingTableFile?.name || organization.tableName || 'My Table'}
        onAddPresetItems={handleAddPresetItems}
        tableLocation={organization.items.length > 0 ? organization.items[0].location : DEFAULT_TABLE_LOCATION}
        onTableLocationChange={handleTableLocationChange}
      />
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              File Organizer Pro - Designed for Virtual Pinball enthusiasts
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-500">
              <span>Client-side processing</span>
              <span>•</span>
              <span>No data stored remotely</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
