import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { AboutSubpage } from "@ngen-about/about-subpage";
import { PageStateHandlerService } from "@ngen-shared/services";

@Component({
   selector: "ngen-introduction",
   templateUrl: "./introduction.component.html",
   styleUrl: "../styles/about-content.scss",
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntroductionComponent {
   private readonly pageStateHandlerService = inject(PageStateHandlerService);

   public readonly AboutSubpages = AboutSubpage;

   public navigateToSubpage(subpage: AboutSubpage): void {
      this.pageStateHandlerService.setAboutSubpage(subpage);
   }
}
