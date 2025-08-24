import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router } from "@angular/router";
import { GeneratorAlgorithmName } from "@ngen-generation/core/enums";
import { RegularUtils } from "@ngen-generation/core/utils";
import { BoundedConfigProperty, PropertyBounds } from "@ngen-generation/generation-config/model";
import { GenerationConfigComponentUtils } from "@ngen-generation/generation-config/utils";
import { RouteUrl } from "@ngen-shared/enums";
import { PageStateHandlerService } from "@ngen-shared/services";

@Component({
   selector: "ngen-generator-info",
   templateUrl: "./generator-info.component.html",
   styleUrl: "../styles/about-content.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [MatIconModule, MatTooltipModule]
})
export class GeneratorInfoComponent {
   private readonly router = inject(Router);
   private readonly pageStateHandlerService = inject(PageStateHandlerService);

   private readonly configPropertyKeys = ["lengthInSyllables", "lengthInLetters"] as const;
   public readonly configPropertyBounds: Record<BoundedConfigProperty, Partial<PropertyBounds>> = {} as any;
   public readonly regulars = RegularUtils.symbols;
   public readonly GeneratorAlgorithmName = GeneratorAlgorithmName;

   constructor() {
      this.configPropertyKeys.forEach(key => {
         this.configPropertyBounds[key] = GenerationConfigComponentUtils.getConfigPropertyBounds(key);
      });
   }

   public navigateToGeneratorAlgorithm(name: GeneratorAlgorithmName): void {
      this.router.navigateByUrl(RouteUrl.GENERATION);
      this.pageStateHandlerService.setGenerator(name);
   }
}
