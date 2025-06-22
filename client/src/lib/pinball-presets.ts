export interface PresetItem {
  id: string;
  label: string;
  type: 'single' | 'multiple' | 'folder';
  defaultLocation: string;
  useTableName: boolean;
  category: string;
}

export interface PresetCategory {
  name: string;
  items: PresetItem[];
}

export const PINBALL_PRESETS: PresetCategory[] = [
  {
    name: "Visual Pinball X",
    items: [
      {
        id: "vpx-directb2s",
        label: "directb2s",
        type: "single",
        defaultLocation: "Tables/",
        useTableName: true,
        category: "Visual Pinball X"
      },
      {
        id: "vpx-rom",
        label: "vPinMAME ROM",
        type: "single",
        defaultLocation: "VPinMAME/roms/",
        useTableName: false,
        category: "Visual Pinball X"
      },
      {
        id: "vpx-dmd-altcolor",
        label: "DMD Alt Color",
        type: "folder",
        defaultLocation: "VPinMAME/altcolor/",
        useTableName: false,
        category: "Visual Pinball X"
      },
      {
        id: "vpx-puppack",
        label: "PupPack",
        type: "folder",
        defaultLocation: "PinUPSystem/PUPVideos/",
        useTableName: false,
        category: "Visual Pinball X"
      }
    ]
  },
  {
    name: "Future Pinball",
    items: [
      {
        id: "fp-library-files",
        label: "Library Files",
        type: "multiple",
        defaultLocation: "Libraries/",
        useTableName: false,
        category: "Future Pinball"
      },
      {
        id: "fp-pinevent-puppack",
        label: "PinEvent PupPack",
        type: "folder",
        defaultLocation: "PinUPSystem/PUPVideos/",
        useTableName: false,
        category: "Future Pinball"
      },
      {
        id: "fp-cfg-pov",
        label: "CFG for POV",
        type: "single",
        defaultLocation: "Config/",
        useTableName: true,
        category: "Future Pinball"
      }
    ]
  },
  {
    name: "Pinball Emporium",
    items: [
      {
        id: "pe-cover",
        label: "Cover",
        type: "single",
        defaultLocation: "media/covers/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-topper",
        label: "Topper",
        type: "single",
        defaultLocation: "media/toppers/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-marquee",
        label: "Marquee",
        type: "single",
        defaultLocation: "media/marquees/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-table",
        label: "Table",
        type: "single",
        defaultLocation: "tables/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-logo",
        label: "Logo",
        type: "single",
        defaultLocation: "media/logos/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-credit",
        label: "Credit",
        type: "single",
        defaultLocation: "media/credits/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-rules",
        label: "Rules",
        type: "single",
        defaultLocation: "media/rules/",
        useTableName: true,
        category: "Pinball Emporium"
      }
    ]
  }
];

export function getPresetById(id: string): PresetItem | undefined {
  for (const category of PINBALL_PRESETS) {
    const item = category.items.find(item => item.id === id);
    if (item) return item;
  }
  return undefined;
}