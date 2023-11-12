import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteUrls } from '@core/enums';

interface NavMenuItem {
  label: string;
  path: string;
}

@Component({
  selector: 'ngen-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public readonly navMenuItems: NavMenuItem[] = [
    { label: 'Generation', path: RouteUrls.GENERATION },
    { label: 'Name Database', path: '' },
    { label: 'About', path: '' }
  ];

  constructor(
    private readonly router: Router
  ) { }

  public navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }
}
