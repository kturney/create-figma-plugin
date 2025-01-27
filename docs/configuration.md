# Configuration

- [JSON schema](#json-schema)
- [Configuration options](#configuration-options)

## JSON schema

Validate the plugin configuration in your `package.json` file using [Create Figma Plugin’s configuration JSON schema](https://yuanqing.github.io/create-figma-plugin/figma-plugin.json).

To enable autocomplete and inline validation of your plugin configuration in [Visual Studio Code](https://code.visualstudio.com), create a `.vscode/settings.json` file containing the following:

```json
{
  "json.schemas": [
    {
      "fileMatch": [
        "package.json"
      ],
      "url": "https://yuanqing.github.io/create-figma-plugin/figma-plugin.json"
    }
  ]
}
```

## Configuration options

Configure your plugin under the **`"figma-plugin"`** key of your `package.json` file.

### `"apiVersion"`

(*`string`*)

*Optional.* The version of the Figma plugin API to use. Defaults to **`"1.0.0"`**.

### `"id"`

(*`string`*)

*Required to publish the plugin on Figma Community.* The plugin ID. This field can be omitted during development but is required if you want to [publish your plugin](https://help.figma.com/hc/en-us/articles/360042293394-Publish-plugins-to-the-Figma-Community). Figma will generate a unique plugin ID for you when you first try to publish the plugin; copy and paste that ID here.

### `"editorType"`

(*`Array<string>`*)

*Optional.* For specifying the editor that the plugin is intended for. One of `["figma"]`, `["figjam"]`, or `["figma", "figjam"]`. Defaults to `["figma"]`.

Learn how to [create a plugin for both Figma and FigJam](https://figma.com/plugin-docs/figma-figjam-plugins/).

### `"name"`

(*`string`*)

*Required.* The name of the plugin.

### `"main"`

(*`string`* or *`object`*)

*Required, unless* **`"menu"`** *is specified.* Path to the main entry point of the plugin command. The plugin command must be the function set as the `default` export of the file. To use a particular named export instead, specify an object with the following keys:

- **`"src"`** (*`string`*) — *Required.* Path to the main entry point of the plugin command.
- **`"handler"`** (*`string`*) — *Required.* The name of the exported function in the file.

***Example***

```json
{
  "figma-plugin": {
    "id": "806532458729477508",
    "name": "Draw Mask Under Selection",
    "main": "src/main.ts"
  }
}
```

### `"ui"`

(*`string`* or *`object`*)

*Optional.* Path to the UI implementation of the plugin command (as specified via the sibling **`"main"`** key). The UI implementation must be the function set as the `default` export of the file. To use a particular named export instead, specify an object with the following keys:

- **`"src"`** (*`string`*) — *Required.* Path to the UI implementation of the plugin command.
- **`"handler"`** (*`string`*) — *Required.* The name of the exported function in the file.

***Example***

```json
{
  "figma-plugin": {
    "id": "767379335945775056",
    "name": "Draw Slice Over Selection",
    "main": "src/main.ts",
    "ui": "src/ui.tsx"
  }
}
```

Learn how to [add a UI to a plugin command](#ui-1).

### `"parameters"`

(*`array`*)

*Optional.* Defines the list of parameters that the plugin command accepts via Figma’s Quick Action UI. Each parameter is an object with the following keys:

- **`"key"`** (*`string`*) — *Required.* The unique key used to identify the parameter.
- **`"name"`** (*`string`*) — *Optional.* The name of the parameter shown in the Quick Actions UI. Defaults to the value of the sibling `"key"` if not specified.
- **`"description"`** (*`string`*) — *Optional.* The description for the parameter shown in the Quick Actions UI.
- **`"allowFreeform"`** (*`boolean`*) — *Optional.* Set to `true` to allow any value to be entered for the parameter, not just the values suggested by the plugin command.
- **`"optional"`** (*`boolean`*) — *Optional.* Set to `true` to make the parameter optional. Optional parameters can only occur at the end of list of parameters. There must be at least one non-optional parameter.

Learn how to [accept parameters via the Quick Actions UI in your plugin command](https://figma.com/plugin-docs/plugin-parameters/).

### `"parameterOnly"`

(*`boolean`*)

*Optional.* Set to `true` to always prompt for parameters in Figma’s Quick Action UI when the plugin command is run.

### `"menu"`

(*`array`*)

*Required, unless* **`"main"`** *is specified.* An array that specifies the commands shown in the plugin’s sub-menu. Each object in the array has the following keys:

- **`"name"`** (*`string`*) — *Required.* The name of the plugin command.
- **`"main"`** (*`string`* or *`object`*) — *Required, unless* **`"menu"`** *is specified.* Ditto the **`"main"`** field above.
- **`"ui"`** (*`string`* or *`object`*) — *Optional.* Ditto the **`"ui"`** field above.
- **`"parameters"`** (*`array`*) — *Optional.* Ditto the **`"parameters"`** field above.
- **`"parameterOnly"`** (*`boolean`*) — *Optional.* Ditto the **`"parameterOnly"`** field above.
- **`"menu"`** (*`array`*) — *Required, unless* **`"main"`** *is specified.* Sub-menus can be nested.

Use a **`"-"`** in the array to specify a separator between commands in the sub-menu.

***Example***

```json
{
  "figma-plugin": {
    "id": "837846252158418235",
    "name": "Flatten Selection to Bitmap",
    "menu": [
      {
        "name": "Flatten Selection to Bitmap",
        "main": "src/flatten-selection-to-bitmap/main.ts",
        "ui": "src/flatten-selection-to-bitmap/ui.ts"
      },
      "-",
      {
        "name": "Settings",
        "main": "src/settings/main.ts",
        "parameters": [
          {
            "key": "resolution",
            "description": "Enter a bitmap resolution"
          }
        ],
        "parameterOnly": true
      }
    ]
  }
}
```

See the [recipe for specifying multiple commands in the plugin sub-menu](#specifying-multiple-commands-in-the-plugin-sub-menu).

### `"relaunchButtons"`

(*`object`*)

*Optional.* An object that specifies the commands that can be set as [relaunch buttons](https://figma.com/plugin-docs/api/properties/nodes-setrelaunchdata/). Each key is a `relaunchButtonId`. Each value specifies the relaunch button command, and is an object with the following keys:

- **`"name"`** (*`string`*) — *Required.* The name of the relaunch button.
- **`"main"`** (*`string`* or *`object`*) — *Required.* Ditto the **`"main"`** field above.
- **`"ui"`** (*`string`* or *`object`*) — *Optional.* Ditto the **`"ui"`** field above.
- **`"multipleSelection"`** (*`boolean`*) — *Optional.* Whether the relaunch button should appear when multiple layers are selected.

***Example***

```json
{
  "figma-plugin": {
    "id": "786286754606650597",
    "name": "Organize Layers",
    "menu": [
      {
        "name": "Organize Layers",
        "main": "src/organize-layers/main.ts",
        "ui": "src/organize-layers/ui.tsx"
      },
      "-",
      {
        "name": "Reset Plugin",
        "main": "src/reset-plugin/main.ts"
      }
    ],
    "relaunchButtons": {
      "organizeLayers": {
        "name": "Organize Layers",
        "main": "src/organize-layers/main.ts",
        "ui": "src/organize-layers/ui.tsx"
      }
    }
  }
}
```

See the [recipe for configuring relaunch buttons](#configuring-relaunch-buttons).

### `"enablePrivatePluginApi"`

(*`boolean`*)

*Optional.* Set to `true` to allow the use of plugin APIs that are only available to private plugins.

### `"enableProposedApi"`

(*`boolean`*)

*Optional.* Set to `true` to allow the use of [Proposed APIs](https://figma.com/plugin-docs/proposed-api/) that are only available during development.
