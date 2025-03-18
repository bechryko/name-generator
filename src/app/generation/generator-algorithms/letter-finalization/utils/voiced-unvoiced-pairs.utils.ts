export class VoicedUnvoicedPairsUtils {
   private static pairsInitialized = false;
   private static readonly pairs: [string, string][] = [];

   public static initPairs() {
      if(this.pairsInitialized) return;
      this.addPair('p', 'b');
      this.addPair('t', 'd');
      this.addPair('k', 'g');
      this.addPair('f', 'v');
      this.addPair('s', 'z');
      this.pairsInitialized = true;
   }

   public static pairOf(letter: string): string | undefined {
      const pair = this.pairs.find(p => p[0] === letter || p[1] === letter);
      if(pair === undefined) return undefined;
      return pair[0] === letter ? pair[1] : pair[0];
   }

   private static addPair(unvoiced: string, voiced: string) {
      this.pairs.push([unvoiced, voiced]);
   }
}
