export class Stopwatch {
   private startTimestamp?: number;

   public start(): void {
      this.startTimestamp = Date.now();
   }

   public stop(): number {
      if (this.startTimestamp === undefined) {
         throw new Error("Stopwatch wasn't started");
      }

      const timeElapsed = Date.now() - this.startTimestamp;
      delete this.startTimestamp;
      return timeElapsed;
   }
}
