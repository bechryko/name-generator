import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgenSidebarSelectable } from '@ngen-core/models';
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
    private readonly router: Router
  ) { }

  public navigate(subpage: AboutSubpages): void {
    this.router.navigateByUrl(`/about/${subpage}`);
  }
}
