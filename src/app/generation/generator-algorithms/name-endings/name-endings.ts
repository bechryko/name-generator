import { RegularUtils } from "../letter-finalization/utils";

const doubleConsonantEndings = [
   "lf",
   "lv",
   "lt",
   "ld",
   "mn",
   "rk",
   "ck"
];

export const nameEndings = [
   "in+",
   "ia-+",
   "ni+",
   "+s",
   "i+s",
   "+n",
   "+m",
   "+nk+",
   "+-+",
   "-ia",
   ...doubleConsonantEndings.map(e => RegularUtils.symbols.vowel + e)
];
