import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Router, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "@ngen-shared/components";
import { NgenSidebarSelectable } from "@ngen-shared/models";
import { PageStateHandlerService } from "@ngen-shared/services";
import { Observable, tap } from "rxjs";
import { AboutSubpages } from "./about-subpages";

@Component({
   selector: "ngen-about",
   templateUrl: "./about.component.html",
   styleUrl: "./about.component.scss",
   imports: [SidebarComponent, RouterOutlet, AsyncPipe],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutComponent {
   private readonly router = inject(Router);
   private readonly pageStateHandlerService = inject(PageStateHandlerService);

   public readonly subpages: NgenSidebarSelectable<AboutSubpages>[] = [
      {
         label: "Introduction",
         description: "Learn about the purpose of this application and how it can help you.",
         value: AboutSubpages.INTRODUCTION
      },
      {
         label: "Generators",
         description: "Learn about the available name generators and their usage.",
         value: AboutSubpages.GENERATORS
      },
      {
         label: "Versions",
         description: "Learn about the version history of this application.",
         value: AboutSubpages.VERSIONS
      }
   ];
   public readonly currentSubpage$: Observable<AboutSubpages>;

   constructor() {
      this.currentSubpage$ = this.pageStateHandlerService.aboutSubpage$.pipe(
         takeUntilDestroyed(),
         tap(subpage => this.navigate(subpage))
      );
   }

   public selectSubpage(subpage: AboutSubpages): void {
      this.pageStateHandlerService.setAboutSubpage(subpage);
   }

   private navigate(subpage: AboutSubpages): void {
      this.router.navigateByUrl(`/about/${subpage}`);
   }
}
