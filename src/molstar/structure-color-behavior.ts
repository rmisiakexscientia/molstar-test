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
    private handleStructure(structure: Structure) {
      // StructureColorPropertyProvider.set(structure, { pocket: [5] }, [5]);
    }
    private handle(ref: string, obj: StateObject<any, StateObject.Type<any>>) {
      if (!PluginStateObject.Molecule.Structure.is(obj)) {
        return;
      }
      const transform = this.ctx.state.data.tree.transforms.get(ref);
      if (
        transform.transformer.definition.isDecorator ||
        obj.data.parent === undefined
      ) {
        return;
      }
      this.handleStructure(obj.data);
    }
    register(): void {
      this.ctx.customStructureProperties.register(
        StructureColorPropertyProvider,
        true
      );
      this.subscribeObservable(
        this.ctx.state.data.events.object.created,
        (o) => {
          this.handle(o.ref, o.obj);
        }
      );
      this.subscribeObservable(
        this.ctx.state.data.events.object.updated,
        (o) => {
          this.handle(o.ref, o.obj);
        }
      );
    }
    unregister() {
      this.ctx.customStructureProperties.unregister(
        StructureColorPropertyProvider.descriptor.name
      );
    }
  },
});
