export class GenerationErrors {
   private errors: string[] = [];

   public add(error: string): void {
      if (!this.errors.includes(error)) {
         this.errors.push(error);
      }
   }

   public shift(): string | undefined {
      return this.errors.shift();
   }

   public clone(): GenerationErrors {
      const newGenerationErrors = new GenerationErrors();
      newGenerationErrors.errors = [...this.errors];
      return newGenerationErrors;
   }
}
