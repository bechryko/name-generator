import { GenerationConfig } from "../models";

export class GenerationConfigUtils {
   public static copyConfig<T extends Partial<GenerationConfig>>(config: T): T {
      const newConfig: T = {} as any;

      for (const key in config) {
         const oldValue = config[key] as any;

         if (typeof oldValue === "object" && "clone" in oldValue) {
            newConfig[key] = oldValue.clone();
         } else {
            newConfig[key] = oldValue;
         }
      }

      return newConfig;
   }
}
