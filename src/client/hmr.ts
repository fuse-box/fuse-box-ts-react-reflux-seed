declare var FuseBox: any;
const customizedHMRPlugin = {
    hmrUpdate: ({ type, path, content }) => {
        if (type === "js") {
            const isModuleNameInPath = (path) => statefulModules.some(name => path.includes(name));

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
}

/** Only register the plugin once */
let alreadyRegistered = false;

/** Current names of stateful modules */
let statefulModules = [];

/**
 * Registers given module names as being stateful
 * @param modulesNames full or partial path to module name
 */
export const setStatefulModules = (...moduleNames: string[]) => {
    if (!alreadyRegistered) {
        alreadyRegistered = true;
        FuseBox.addPlugin(customizedHMRPlugin);
    }
    statefulModules = moduleNames;
}
