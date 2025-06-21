import { useState, useCallback } from 'react';
import { OrganizationItem, OrganizationTemplate } from '@/types/organization';
import { nanoid } from 'nanoid';

export function useOrganization() {
  const [items, setItems] = useState<OrganizationItem[]>([]);
  const [tableName, setTableName] = useState<string>('');
  const [tableFile, setTableFile] = useState<File | null>(null);

  const addItem = useCallback((type: 'single' | 'multiple' | 'folder', itemData?: Partial<OrganizationItem>) => {
    const newItem: OrganizationItem = {
      id: nanoid(),
      type,
      label: itemData?.label || '',
      location: itemData?.location || '',
      options: itemData?.options || {},
      files: itemData?.files || []
    };
    setItems(prev => [...prev, newItem]);
  }, []);

  const addFirstItem = useCallback((tableFile: File) => {
    const firstItem: OrganizationItem = {
      id: nanoid(),
      type: 'single',
      label: 'Table File',
      location: 'tables/',
      options: { useTableName: true },
      files: [tableFile]
    };
    setItems([firstItem]);
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<OrganizationItem>) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const loadTemplate = useCallback((template: OrganizationTemplate) => {
    const loadedItems = template.items.map(item => ({
      ...item,
      id: nanoid(),
      files: []
    }));
    setItems(loadedItems);
  }, []);

  const clearAll = useCallback(() => {
    setItems([]);
    setTableName('');
    setTableFile(null);
  }, []);

  const exportTemplate = useCallback((): OrganizationTemplate => {
    return {
      name: 'Custom Template',
      version: '1.0.0',
      items: items.map(({ files, ...item }) => item),
      metadata: {
        created: new Date().toISOString(),
        description: 'User created template'
      }
    };
  }, [items]);

  return {
    items,
    tableName,
    tableFile,
    setTableName,
    setTableFile,
    addItem,
    addFirstItem,
    updateItem,
    removeItem,
    loadTemplate,
    clearAll,
    exportTemplate
  };
}
