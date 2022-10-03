const _cache: any = {};

const TemplateCache = {
  get(name: string, version: string): any {
    return _cache[name + ":" + version];
  },

  set(name: string, version: string, template: any): any {
    _cache[name + ":" + version] = template;
  },
};

export default TemplateCache;
