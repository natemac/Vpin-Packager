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
  parentPath: string;
  items: PresetItem[];
}

export const PINBALL_PRESETS: PresetCategory[] = [
  {
    name: "Visual Pinball X",
    parentPath: "/emulators/Visual Pinball/",
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
    parentPath: "/emulators/Future Pinball/",
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
        defaultLocation: "BAM/cfg/",
        useTableName: true,
        category: "Future Pinball"
      }
    ]
  },
  {
    name: "Pinball Emporium Media",
    parentPath: "/collections/Visual Pinball X/medium_artwork/",
    items: [
      {
        id: "pe-cover",
        label: "Cover",
        type: "single",
        defaultLocation: "covers/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-topper",
        label: "Topper",
        type: "single",
        defaultLocation: "toppers/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-marquee",
        label: "Marquee",
        type: "single",
        defaultLocation: "collections/(EMULATOR)/medium_artwork/video_marquees/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-table",
        label: "Table",
        type: "single",
        defaultLocation: "collections/(EMULATOR)/medium_artwork/video/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-logo",
        label: "Logo",
        type: "single",
        defaultLocation: "collections/(EMULATOR)/medium_artwork/logo/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-credit",
        label: "Credit",
        type: "single",
        defaultLocation: "collections/(EMULATOR)/medium_artwork/credit/",
        useTableName: true,
        category: "Pinball Emporium"
      },
      {
        id: "pe-rules",
        label: "Rules",
        type: "single",
        defaultLocation: "collections/(EMULATOR)/medium_artwork/rules",
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