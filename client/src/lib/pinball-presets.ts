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

export const DEFAULT_TABLE_LOCATION = "emulators/Visual Pinball/Tables/";

export const PINBALL_PRESETS: PresetCategory[] = [
  {
    name: "Visual Pinball X",
    parentPath: "emulators/Visual Pinball/",
    items: [
      {
        id: "vpx-directb2s",
        label: "directb2s Backglass",
        type: "single",
        defaultLocation: "Tables/",
        useTableName: true,
        category: "Visual Pinball X"
      },
      {
        id: "vpx-directb2sRES",
        label: "directb2s Resolution",
        type: "single",
        defaultLocation: "Tables/",
        useTableName: true,
        category: "Visual Pinball X"
      },
      {
        id: "vpx-dmd-altcolor",
        label: "DMD AltColor",
        type: "folder",
        defaultLocation: "VPinMAME/altcolor/",
        useTableName: false,
        category: "Visual Pinball X"
      },
      {
        id: "vpx-dmd-altsound",
        label: "DMD AltSound",
        type: "folder",
        defaultLocation: "VPinMAME/altsound/",
        useTableName: false,
        category: "Visual Pinball X"
      },
      {
        id: "vpx-FlexDMD",
        label: "FlexDMD",
        type: "folder",
        defaultLocation: "VPinMAME/Tables/",
        useTableName: false,
        category: "Visual Pinball X"
      },
      {
        id: "vpx-rom",
        label: "vPinMAME ROM",
        type: "single",
        defaultLocation: "VPinMAME/roms/",
        useTableName: false,
        category: "Visual Pinball X"
      }
    ]
  },
  {
    name: "Future Pinball",
    parentPath: "emulators/Future Pinball/",
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
        id: "fp-cfg",
        label: "BAM CFGs",
        type: "multiple",
        defaultLocation: "BAM/cfg/",
        useTableName: true,
        category: "Future Pinball"
      }
    ]
  },
  {
    name: "PubPack",
    parentPath: "emulators/",
    items: [
      {
        id: "vpx-puppack",
        label: "PupPack",
        type: "folder",
        defaultLocation: "PinUPSystem/PUPVideos/",
        useTableName: false,
        category: "PupPack"
      }
    ]
  },
  {
    name: "Pinball FX/FX3/M",
    parentPath: "Steam/stemapps/common/Pinball FX/PinballFX/",
    items: [
      {
        id: "fx-backglass",
        label: "Backglass",
        type: "single",
        defaultLocation: "Mods/Cabinet/",
        useTableName: false,
        category: "Pinball FX"
      }
    ]
  },
  {
    name: "Pinball Emporium Media",
    parentPath: "collections/Visual Pinball X/medium_artwork/",
    items: [
      {
        id: "pe-cover",
        label: "Cover",
        type: "single",
        defaultLocation: "covers/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-topper",
        label: "Topper",
        type: "single",
        defaultLocation: "toppers/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-marquee",
        label: "Marquee",
        type: "single",
        defaultLocation: "marquees/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-table",
        label: "Table",
        type: "single",
        defaultLocation: "tables/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-logo",
        label: "Logo",
        type: "single",
        defaultLocation: "logos/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-credit",
        label: "Credit",
        type: "single",
        defaultLocation: "credits/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-rules",
        label: "Rules",
        type: "single",
        defaultLocation: "rules/",
        useTableName: true,
        category: "Pinball Emporium Media"
      }
    ]
  },
  {
    name: "Pinup Popper Media",
    parentPath: "collections/Visual Pinball X/medium_artwork/",
    items: [
      {
        id: "pp-wheel",
        label: "Wheel",
        type: "single",
        defaultLocation: "wheel/",
        useTableName: true,
        category: "Pinup Popper Media"
      },
      {
        id: "pp-audio",
        label: "Audio",
        type: "single",
        defaultLocation: "audio/",
        useTableName: true,
        category: "Pinup Popper Media"
      },
      {
        id: "pp-audiolaunchshort",
        label: "Audio Launch Short",
        type: "single",
        defaultLocation: "audio launch short/",
        useTableName: true,
        category: "Pinup Popper Media"
      },
      {
        id: "pp-audiolaunch",
        label: "Audio Launch",
        type: "single",
        defaultLocation: "audio launch/",
        useTableName: true,
        category: "Pinup Popper Media"
      },
      {
        id: "pp-backglass",
        label: "Backglass",
        type: "single",
        defaultLocation: "backglass/",
        useTableName: true,
        category: "Pinup Popper Media"
      },
      {
        id: "pp-loadingsignshort",
        label: "Loading Sign Short",
        type: "single",
        defaultLocation: "loading sign short/",
        useTableName: true,
        category: "Pinup Popper Media"
      },
      {
        id: "pp-loadingsign",
        label: "Loading Sign",
        type: "single",
        defaultLocation: "loading sign/",
        useTableName: true,
        category: "Pinup Popper Media"
      },
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