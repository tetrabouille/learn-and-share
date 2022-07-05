import { writable } from 'svelte/store';

export enum BreakPointEnum {
  XS,
  SM,
  MD,
  LG,
  XL,
  XXL,
}

export type BreakPoint = {
  value: number | null;
  code: BreakPointEnum | null;
};

const getBreakPointValue = (breakPoint: BreakPointEnum) => {
  switch (breakPoint) {
    case BreakPointEnum.XS:
      return 370;
    case BreakPointEnum.SM:
      return 640;
    case BreakPointEnum.MD:
      return 770;
    case BreakPointEnum.LG:
      return 1024;
    case BreakPointEnum.XL:
      return 1280;
    case BreakPointEnum.XXL:
      return 1536;
    default:
      return null;
  }
};

const getBreakPoints = () =>
  Object.keys(BreakPointEnum)
    .filter((item) => {
      return isNaN(Number(item));
    })
    .map((name) => ({
      name,
      value: getBreakPointValue(BreakPointEnum[name]),
      code: BreakPointEnum[name],
    }));

const breakPointStore = writable<BreakPoint>({
  value: getBreakPointValue(BreakPointEnum.MD),
  code: BreakPointEnum.MD,
});

const getLowerBreakpoint = (code: BreakPointEnum) => {
  switch (code) {
    default:
    case BreakPointEnum.XS:
      return null;
    case BreakPointEnum.SM:
      return BreakPointEnum.XS;
    case BreakPointEnum.MD:
      return BreakPointEnum.SM;
    case BreakPointEnum.LG:
      return BreakPointEnum.MD;
    case BreakPointEnum.XL:
      return BreakPointEnum.LG;
    case BreakPointEnum.XXL:
      return BreakPointEnum.XL;
  }
};

const updateBreakPoint = (code: BreakPointEnum, matches: boolean) => {
  if (matches) {
    return breakPointStore.set({
      value: getBreakPointValue(code),
      code,
    });
  }
  const lowerBreakpoint = getLowerBreakpoint(code);
  breakPointStore.set({
    value: getBreakPointValue(lowerBreakpoint),
    code: lowerBreakpoint,
  });
};

export { breakPointStore, getBreakPointValue, getBreakPoints, updateBreakPoint };
