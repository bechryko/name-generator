import { Component } from '@angular/core';
import { AboutSubpages } from '@ngen-about/about-subpages';

@Component({
  selector: 'ngen-introduction',
  templateUrl: './introduction.component.html',
  styleUrl: '../styles/about-content.scss'
})
export class IntroductionComponent {
  public readonly subpages = AboutSubpages;
}
