export class AppInitializationUtils {
   public static all() {
      this.enhanceBuiltInTypes();
   }

   private static enhanceBuiltInTypes() {
      //@ts-ignore
      Array.prototype.last = function() {
         return this[this.length - 1];
      };
   }
}