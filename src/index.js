export default (options = {}) => {
    const name = 'rollup-non-js-entry';
    const extensions = options.extensions ?? ['.css', '.styl', '.scss', '.sass', '.less']
    const onlyOnWrite = options.onlyOnWrite ?? false;

    return {
        name,
        options(options) {
            const { plugins } = options;
            const pluginIndex = plugins.findIndex(plugin => plugin.name === name);

            if(pluginIndex !== -1){
                const pluginElement = plugins.splice(pluginIndex, 1)[0]
                plugins.push(pluginElement);
            }

            return options
        },
        async generateBundle(options, bundle, isWrite) {
            if(onlyOnWrite && !isWrite) return;
            if(!Object.keys(bundle).length > 1) return;

            for(const key in bundle){
                const {isEntry, facadeModuleId} = bundle[key];
                if (isEntry && facadeModuleId) {
                    extensions.forEach(ele => {
                        if(facadeModuleId.endsWith(ele)){
                            delete bundle[key];
                        }
                    });

                    break;
                }
            }

            return bundle;
        }
    };
}