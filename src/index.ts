interface IPluginOptions {
  extensions?: string | Array<string>,
  onlyOnWrite?: boolean
}

export default (pluginOptions: IPluginOptions) => {
  const name = 'rollup-non-js-entry';
  const extensions = pluginOptions.extensions ?? ['.css', '.styl', '.scss', '.sass', '.less'];
  const onlyOnWrite = pluginOptions.onlyOnWrite ?? false;

  return {
    name,
    options(options) {
      const { plugins } = options;
      const pluginIndex = plugins.findIndex((plugin) => plugin.name === name);

      if (pluginIndex !== -1) {
        const pluginElement = plugins.splice(pluginIndex, 1)[0];
        plugins.push(pluginElement);
      }

      return options;
    },
    async generateBundle(options, bundle, isWrite) {
      const keys = Object.keys(bundle);

      if (onlyOnWrite && !isWrite) return;
      if (!(keys.length > 1)) return;

      keys.forEach((key) => {
        const { isEntry, facadeModuleId } = bundle[key];
        if (isEntry && facadeModuleId) {
          if (Array.isArray(extensions)) {
            extensions.forEach((ele) => {
              if (facadeModuleId.endsWith(ele)) {
                delete bundle[key];
              }
            });
          } else if (typeof extensions === 'string') {
            if (facadeModuleId.endsWith(extensions)) {
              delete bundle[key];
            }
          }
        }
      });

      return bundle;
    },
  };
};
