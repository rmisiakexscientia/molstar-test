import { useEffect, createRef } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
/*  Might require extra configuration,
see https://webpack.js.org/loaders/sass-loader/ for example.
create-react-app should support this natively. */
import "molstar/lib/mol-plugin-ui/skin/light.scss";
import { StructureColorBehaviour } from "./structure-color-behavior";
import { PluginSpec } from "molstar/lib/mol-plugin/spec";
import { polymerHotspot } from "./hotspot-preset";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { HotspotThemeProvider } from "./hotspot-theme";
import {
  StateObjectRef,
  StateObjectSelector,
  StateSelection,
} from "molstar/lib/mol-state";
import { StructureColorPropertyProvider } from "./structure-property-provider";
import { StructureFromModel } from "molstar/lib/mol-plugin-state/transforms/model";
import { PluginStateObject } from "molstar/lib/mol-plugin-state/objects";

declare global {
  interface Window {
    molstar?: PluginUIContext;
  }
}

export function MolStarWrapper() {
  const parent = createRef<HTMLDivElement>();

  const registerItems = (plugin: PluginUIContext) => {
    plugin.representation.structure.themes.colorThemeRegistry.add(
      HotspotThemeProvider
    );

    plugin.builders.structure.representation.registerPreset(polymerHotspot);
  };

  const loadData = async (plugin: PluginUIContext) => {
    const data = await plugin.builders.data.download(
      {
        url: "https://files.rcsb.org/download/3PTB.pdb",
      } /* replace with your URL */,
      { state: { isGhost: true } }
    );
    const trajectory = await plugin.builders.structure.parseTrajectory(
      data,
      "pdb"
    );
    const preset = await plugin.builders.structure.hierarchy.applyPreset(
      trajectory,
      "default"
    );

    return { trajectory, preset };
  };

  const applyHotspot = async (
    plugin: PluginUIContext,
    trajectory: StateObjectSelector,
    preset: { representation: any } & any
  ) => {
    const ref = StateObjectRef.resolve(plugin.state.data, trajectory)!;
    const structure = StateSelection.Generators.byRef(ref.transform.ref)
      .subtree()
      .withTransformer(StructureFromModel)
      .select(plugin.state.data)[0];
    if (structure.obj?.data) {
      // This should trigger an update/rerun of the theme?
      StructureColorPropertyProvider.set(
        structure.obj?.data,
        { pocket: [1, 2, 3] },
        [1, 2, 3]
      );
    }

    await plugin
      .build()
      .to(preset!.representation.representations.polymer)
      .update({})
      .commit();
  };

  useEffect(() => {
    async function init() {
      const plugin = await createPluginUI(parent.current as HTMLDivElement, {
        behaviors: [PluginSpec.Behavior(StructureColorBehaviour)],
        config: [
          [
            PluginConfig.Structure.DefaultRepresentationPreset,
            "polymer-hotspot",
          ],
        ],
      });
      window.molstar = plugin;

      registerItems(plugin);

      const { trajectory, preset } = await loadData(plugin);

      applyHotspot(plugin, trajectory, preset);
    }
    init();
    return () => {
      window.molstar?.dispose();
      window.molstar = undefined;
    };
  }, [parent]);

  return <div ref={parent} style={{ width: 640, height: 480 }} />;
}
