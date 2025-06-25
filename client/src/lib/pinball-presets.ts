export const APP_VERSION = "0.1-250624_2130";

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
        defaultLocation: "cover/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-topper",
        label: "Topper",
        type: "single",
        defaultLocation: "topper/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-marquee",
        label: "Marquee",
        type: "single",
        defaultLocation: "video_marquee/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-table",
        label: "Table",
        type: "single",
        defaultLocation: "video/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-logo",
        label: "Logo",
        type: "single",
        defaultLocation: "logo/",
        useTableName: true,
        category: "Pinball Emporium Media"
      },
      {
        id: "pe-credit",
        label: "Credit",
        type: "single",
        defaultLocation: "credit/",
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
    "name": "PinUp Popper Media",
    "parentPath": "PinUPSystem/POPMedia/VisualPinball",
    "items": [
      {
        "id": "pp-audio",
        "label": "Audio",
        "type": "single",
        "defaultLocation": "Audio/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-audiolaunch",
        "label": "AudioLaunch",
        "type": "single",
        "defaultLocation": "AudioLaunch/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-backglass",
        "label": "BackGlass",
        "type": "single",
        "defaultLocation": "BackGlass/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-dmd",
        "label": "DMD",
        "type": "single",
        "defaultLocation": "DMD/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-gamehelp",
        "label": "GameHelp",
        "type": "single",
        "defaultLocation": "GameHelp/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-gameinfo",
        "label": "GameInfo",
        "type": "single",
        "defaultLocation": "GameInfo/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-gameselect",
        "label": "GameSelect",
        "type": "single",
        "defaultLocation": "GameSelect/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-loading",
        "label": "Loading",
        "type": "single",
        "defaultLocation": "Loading/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-menu",
        "label": "Menu",
        "type": "single",
        "defaultLocation": "Menu/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-other1",
        "label": "Other1",
        "type": "single",
        "defaultLocation": "Other1/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-other2",
        "label": "Other2",
        "type": "single",
        "defaultLocation": "Other2/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-playfield",
        "label": "PlayField",
        "type": "single",
        "defaultLocation": "PlayField/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-system",
        "label": "System",
        "type": "single",
        "defaultLocation": "System/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-topper",
        "label": "Topper",
        "type": "single",
        "defaultLocation": "Topper/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      },
      {
        "id": "pp-wheel",
        "label": "Wheel",
        "type": "single",
        "defaultLocation": "Wheel/",
        "useTableName": true,
        "category": "PinUp Popper Media"
      }
    ]
  },
  {
    name: "PinballX Media",
    parentPath: "Media/Visual Pinball/",
    items: [
      {
        id: "px-backglass",
        label: "Backglass",
        type: "single",
        defaultLocation: "Backglass Image/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-dmd",
        label: "DMD",
        type: "single",
        defaultLocation: "DMD Image/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-fulldmd",
        label: "FullDMD",
        type: "single",
        defaultLocation: "fullDMD Video/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-launchaudio",
        label: "Launch Audio",
        type: "single",
        defaultLocation: "Launch Audio/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-realdmdcolor",
        label: "Real DMD Color",
        type: "single",
        defaultLocation: "Real DMD Color Images/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-realdmd",
        label: "Real DMD",
        type: "single",
        defaultLocation: "Real DMD Images/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-tableaudio",
        label: "Table Audio",
        type: "single",
        defaultLocation: "Table Audio/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-table",
        label: "Table",
        type: "single",
        defaultLocation: "Table Images/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-topper",
        label: "Topper",
        type: "single",
        defaultLocation: "Topper Images/",
        useTableName: true,
        category: "PinballX Media"
      },
      {
        id: "px-wheel",
        label: "Wheel",
        type: "single",
        defaultLocation: "Wheel Image/",
        useTableName: true,
        category: "PinballX Media"
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