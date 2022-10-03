// This is a simple function that allows us to map the same function
// to multiple props
// <div {..._p("onClick", "onContextMenu", (e: any) => {console.log('ok');})} />

export const _p = (...args) => {
  const func = args.pop();
  return args.reduce(
    (a, p) => ({
      ...a,
      [p]: func,
    }),
    {}
  );
};
