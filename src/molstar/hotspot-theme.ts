import { hash2 } from "molstar/lib/mol-data/util";
import { CustomProperty } from "molstar/lib/mol-model-props/common/custom-property";
import { Location } from "molstar/lib/mol-model/location";
import { ColorTheme } from "molstar/lib/mol-theme/color";
import { ThemeDataContext } from "molstar/lib/mol-theme/theme";
import { ColorNames } from "molstar/lib/mol-util/color/names";
import { ParamDefinition } from "molstar/lib/mol-util/param-definition";

import { StructureColorPropertyProvider } from "./structure-property-provider";

// Based on
// https://github.com/molstar/molstar/blob/master/src/examples/basic-wrapper/coloring.ts
// https://github.com/molstar/molstar/blob/master/src/extensions/model-archive/quality-assessment/color/qmean.ts

const Theme = (
  ctx: ThemeDataContext,
  props: ParamDefinition.Values<ParamDefinition.Params>
): ColorTheme<ParamDefinition.Params> => {
  const structureColorProperty =
    ctx.structure && StructureColorPropertyProvider.get(ctx.structure);

  const contextHash = structureColorProperty
    ? hash2(structureColorProperty.id, structureColorProperty.version)
    : -1;
  console.log(
    "theme called",
    structureColorProperty && structureColorProperty.value,
    contextHash
  );

  return {
    factory: Theme,
    granularity: "group",
    contextHash,
    color: (location: Location) => {
      return ColorNames.grey;
    },
    props,
  };
};

export const HotspotThemeProvider: ColorTheme.Provider<ParamDefinition.Params> =
  {
    name: "hotspot-color-theme",
    label: "Hotspot Color Theme",
    category: "Atom Property",
    factory: Theme,
    getParams: () => ({}),
    defaultValues: {},
    isApplicable: () => true,
    ensureCustomProperties: {
      attach: (ctx: CustomProperty.Context, data: ThemeDataContext) =>
        data.structure
          ? StructureColorPropertyProvider.attach(
              ctx,
              data.structure,
              void 0,
              true
            )
          : Promise.resolve(),
      detach: (data) =>
        data.structure &&
        StructureColorPropertyProvider.ref(data.structure, false),
    },
  };
