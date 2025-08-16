import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AboutSubpages } from "@ngen-about/about-subpages";
import { PageStateHandlerService } from "@ngen-shared/services";

@Component({
   selector: "ngen-introduction",
   templateUrl: "./introduction.component.html",
   styleUrl: "../styles/about-content.scss",
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroductionComponent {
   private readonly pageStateHandlerService = inject(PageStateHandlerService);

   public readonly AboutSubpages = AboutSubpages;

   public navigateToSubpage(subpage: AboutSubpages): void {
      this.pageStateHandlerService.setAboutSubpage(subpage);
   }
}
