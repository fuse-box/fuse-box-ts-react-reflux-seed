import * as Reflux from "reflux";
import * as React from "react";
import Actions from "../actions";

export class TestStore extends Reflux.Store {
    private listenables = Actions;
    // typescript just relax okay?
    private setState: any;
    private state = {
        counter: 0
    }

    private onIncrementSomething() {
        this.setState({
            counter: ++this.state.counter
        });
    }
}

declare var FuseBox: any;
const registerStatefulModules = (moduleNames: string[]) => FuseBox.addPlugin({
    hmrUpdate: ({ type, path, content }) => {
        if (type === "js") {
            const isModuleNameInPath = (path) => moduleNames.some(name => path.includes(name));

            /** If a stateful module has changed reload the window */
            if (isModuleNameInPath(path)) {
                window.location.reload();
            }

            /** Otherwise flush the other modules */
            FuseBox.flush(function(fileName) {
                return !isModuleNameInPath(fileName);
            });
            /** Patch the module at give path */
            FuseBox.dynamic(path, content);

            /** Re-import / run the mainFile */
            if (FuseBox.mainFile) {
                FuseBox.import(FuseBox.mainFile)
            }

            /** We don't want the default behavior */
            return true;
        }
    }
});

registerStatefulModules(['TestStore', 'actions/index']);
