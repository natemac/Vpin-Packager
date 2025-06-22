import { useState } from "react";
import { FolderOpen } from "lucide-react";
import { useOrganization } from "@/hooks/use-organization";
import FileUploadZone from "@/components/file-upload-zone";
import OrganizationBuilder from "@/components/organization-builder";
import FileTreePreview from "@/components/file-tree-preview";
import PackageGenerator from "@/components/package-generator";
import QuickActions from "@/components/quick-actions";

export default function FileOrganizer() {
  const organization = useOrganization();
  const [includeTable, setIncludeTable] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
            <FolderOpen className="text-primary mr-3 h-6 w-6" />
            File Organizer Pro
            <span className="text-sm font-normal text-slate-500 ml-2">Virtual Pinball Edition</span>
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column (2/3) */}
          <div className="col-span-8 space-y-6">
            <FileUploadZone 
              onFileSelect={(file, name) => {
                organization.setTableFile(file);
                organization.setTableName(name);
                organization.addFirstItem(file);
              }}
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
            />
            
            <FileTreePreview 
              items={organization.items}
              tableName={organization.tableName}
              includeTable={includeTable}
            />
          </div>
        </div>
      </main>

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
