export default (options = {}) => {
    const name = 'rollup-non-js-entry';
    const pluginOptions = {
        extensions: ['.css', '.styl', '.scss', '.sass', '.less'],
        ...options
    }

    return {
        name,
        options(options) {
            const {plugins} = options;
            const to = plugins.length - 2;
            const pluginIndex = plugins.findIndex(plugin => plugin.name === name);

            if(pluginIndex !== -1){
                const pluginElement = plugins.splice(pluginIndex, 1)[0]
                plugins.splice(to, 0, pluginElement);
            }

            return options
        },
        async generateBundle(options, bundle) {
            const bundleKeys = Object.keys(bundle);

            if(bundleKeys.length > 1){
                for(const key in bundle){
                    const {isEntry, facadeModuleId} = bundle[key];
                    if (isEntry && facadeModuleId) {
                        pluginOptions.extensions.forEach(ele => {
                            if(facadeModuleId.endsWith(ele)){
                                delete bundle[key];
                            }
                        });

                        break;
                    }
                }
            }

            return bundle;
        }
    };
}