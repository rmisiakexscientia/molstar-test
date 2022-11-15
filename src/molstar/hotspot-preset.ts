import {
  StructureRepresentationPresetProvider,
  presetStaticComponent,
} from "molstar/lib/mol-plugin-state/builder/structure/representation-preset";
import { StructureRepresentationProps } from "molstar/lib/mol-plugin-state/helpers/structure-representation-params";
import { MolecularSurfaceRepresentationProvider } from "molstar/lib/mol-repr/structure/representation/molecular-surface";
import { StateObjectRef } from "molstar/lib/mol-state";

import { HotspotThemeProvider } from "./hotspot-theme";

const BuiltInPresetGroupName = "Basic";
const CommonParams = StructureRepresentationPresetProvider.CommonParams;

export const polymerHotspot = StructureRepresentationPresetProvider({
  id: "polymer-hotspot",
  display: {
    name: "Polymer Hotspot",
    group: BuiltInPresetGroupName,
  },
  params: () => CommonParams,
  async apply(ref, params, plugin) {
    const structureCell = StateObjectRef.resolveAndCheck(
      plugin.state.data,
      ref
    );
    if (!structureCell) {
      return {};
    }

    const components = {
      polymer: await presetStaticComponent(plugin, structureCell, "polymer"),
    };

    if (!structureCell.obj) {
      return {};
    }
    const structure = structureCell.obj.data;

    const { update, builder, typeParams } =
      StructureRepresentationPresetProvider.reprBuilder(
        plugin,
        params,
        structure
      );

    const representations = {
      polymer: builder.buildRepresentation<StructureRepresentationProps>(
        update,
        components.polymer,
        {
          type: MolecularSurfaceRepresentationProvider,
          typeParams: { ...typeParams, alpha: 1 },
          color: HotspotThemeProvider,
          colorParams: {},
        },
        { tag: "polymer" }
      ),
    };

    await update.commit({ revertOnError: false });

    return { components, representations };
  },
});
