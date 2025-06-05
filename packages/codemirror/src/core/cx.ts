export const cx = (...classes: (string | undefined | null | false)[]) =>
  classes.filter(Boolean).join(' ')
