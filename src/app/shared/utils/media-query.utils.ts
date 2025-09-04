import { Breakpoint } from "@ngen-shared/enums";

export class MediaQueryUtils {
   // should be always up to date with the breakpoints in mq.scss
   private static readonly breakpointPxMap: Record<Breakpoint, number> = {
      [Breakpoint.SMALL_WIDTH]: this.rem(32.5),
      [Breakpoint.MEDIUM_WIDTH]: this.rem(55)
   };

   public static maxWidth(breakpoint: Breakpoint): boolean {
      return window.innerWidth <= this.breakpointPxMap[breakpoint];
   }

   private static rem(px: number): number {
      return px * 16;
   }
}
