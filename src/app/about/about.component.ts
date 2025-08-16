import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { EventType, Router, RouterOutlet } from "@angular/router";
import { SidebarComponent } from "@ngen-shared/components";
import { NgenSidebarSelectable } from "@ngen-shared/models";
import { PageStateHandlerService } from "@ngen-shared/services";
import { filter, Observable, tap } from "rxjs";
import { AboutSubpage } from "./about-subpage";

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

   public readonly subpages: NgenSidebarSelectable<AboutSubpage>[] = [
      {
         label: "Introduction",
         description: "Learn about the purpose of this application and how it can help you.",
         value: AboutSubpage.INTRODUCTION
      },
      {
         label: "Generators",
         description: "Learn about the available name generators and their usage.",
         value: AboutSubpage.GENERATORS
      },
      {
         label: "Versions",
         description: "Learn about the version history of this application.",
         value: AboutSubpage.VERSIONS
      }
   ];
   public readonly currentSubpage$: Observable<AboutSubpage>;

   constructor() {
      this.currentSubpage$ = this.pageStateHandlerService.aboutSubpage$.pipe(
         takeUntilDestroyed(),
         tap(subpage => this.navigate(subpage))
      );

      this.router.events
         .pipe(
            takeUntilDestroyed(),
            filter(event => event.type === EventType.NavigationEnd)
         )
         .subscribe(event => this.selectSubpage(this.getSubpageFromUrl(event.urlAfterRedirects)));
   }

   public selectSubpage(subpage: AboutSubpage): void {
      this.pageStateHandlerService.setAboutSubpage(subpage);
   }

   private navigate(subpage: AboutSubpage): void {
      this.router.navigateByUrl(`/about/${subpage}`);
   }

   private getSubpageFromUrl(url: string): AboutSubpage {
      const subpage = url.split("/").at(-1);
      return subpage as AboutSubpage;
   }
}
