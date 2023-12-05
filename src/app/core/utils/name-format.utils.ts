export class NameFormatUtils {
   public static capitalizeName(name: string): string {
      return name[0].toUpperCase() + name.substring(1);
   }
}
