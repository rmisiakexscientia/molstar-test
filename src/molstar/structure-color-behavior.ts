import { Structure } from "molstar/lib/mol-model/structure";
import { PluginStateObject } from "molstar/lib/mol-plugin-state/objects";
import { PluginBehavior } from "molstar/lib/mol-plugin/behavior";
import { StateObject } from "molstar/lib/mol-state";

import { StructureColorPropertyProvider } from "./structure-property-provider";

export const StructureColorBehaviour = PluginBehavior.create({
  name: "structure-color-prop",
  category: "custom-props",
  display: { name: "Structure Color" },
  ctor: class extends PluginBehavior.Handler {
    register(): void {
      this.ctx.customStructureProperties.register(
        StructureColorPropertyProvider,
        true
      );
    }
    unregister() {
      this.ctx.customStructureProperties.unregister(
        StructureColorPropertyProvider.descriptor.name
      );
    }
  },
});
