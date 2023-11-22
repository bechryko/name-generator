import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { NgenSidebarSelectable } from '@ngen-core/models';
import { PageStateHandlerService } from '@ngen-core/services';
import { AboutSubpages } from './about-subpages';

@Component({
  selector: 'ngen-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  public readonly subpages: NgenSidebarSelectable<AboutSubpages>[] = [
    {
      label: 'Introduction',
      description: 'Learn about the purpose of this application and how it can help you.',
      value: AboutSubpages.INTRODUCTION
    }, {
      label: 'Generators',
      description: 'Learn about the available name generators and their usage.',
      value: AboutSubpages.GENERATORS
    }, {
      label: 'Developer',
      description: 'Learn about the person who stands behind this application.',
      value: AboutSubpages.DEVELOPMENT
    }, {
      label: 'Versions',
      description: 'Learn about the version history of this application.',
      value: AboutSubpages.VERSIONS
    }
  ];

  constructor(
    private readonly router: Router,
    private readonly pageStateHandlerService: PageStateHandlerService
  ) {
    this.pageStateHandlerService.aboutSubpage$.pipe(
      takeUntilDestroyed()
    ).subscribe(subpage => this.navigate(subpage));
  }

  public selectSubpage(subpage: AboutSubpages): void {
    this.pageStateHandlerService.setAboutSubpage(subpage);
  }

  private navigate(subpage: AboutSubpages): void {
    this.router.navigateByUrl(`/about/${subpage}`);
  }
}
