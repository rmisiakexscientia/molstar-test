import { CustomProperty } from "molstar/lib/mol-model-props/common/custom-property";
import { CustomStructureProperty } from "molstar/lib/mol-model-props/common/custom-structure-property";
import { CustomPropertyDescriptor } from "molstar/lib/mol-model/custom-property";
import { Structure } from "molstar/lib/mol-model/structure";
import { ParamDefinition } from "molstar/lib/mol-util/param-definition";

const StructureColorPropertyParams = {
  pocket: ParamDefinition.Value([] as number[]),
};
type StructureColorPropertyParamsParams = typeof StructureColorPropertyParams;
type StructureColorPropertyProps =
  ParamDefinition.Values<StructureColorPropertyParamsParams>;

export const StructureColorPropertyProvider =
  CustomStructureProperty.createProvider({
    label: "Structure Color",
    descriptor: CustomPropertyDescriptor({
      name: "structure-color",
    }),
    type: "root",
    defaultParams: StructureColorPropertyParams,
    getParams: () => StructureColorPropertyParams,
    isApplicable: () => true,
    obtain: (
      _: CustomProperty.Context,
      __: Structure,
      props: Partial<StructureColorPropertyProps>
    ) =>
      Promise.resolve({
        value: [] as number[],
      }),
  });
