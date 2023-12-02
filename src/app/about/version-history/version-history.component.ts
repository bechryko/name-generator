import { Component } from '@angular/core';

interface VersionDetails {
   id: string;
   name?: string;
   date: Date;
   content: string[];
}

@Component({
   selector: 'ngen-version-history',
   templateUrl: './version-history.component.html',
   styleUrl: '../styles/about-content.scss'
})
export class VersionHistoryComponent {
   private readonly versions: VersionDetails[] = [
      {
         id: '1.0',
         name: 'Vetlarrmeltheld',
         date: new Date(Date.now()), //TODO
         content: [
            "Where it all began",
            "Added japanese generator algorithm (on version 1.0)",
            "Added syllabic generator algorithm (on version 1.0)",
            "Added regular generator algorithm (on version 1.0)",
            "Added Database page with the best names saved",
            "Added About page with loads of information"
         ]
      }
   ];

   public get namedVersions(): VersionDetails[] {
      return this.versions.filter(v => v.name).sort((a, b) => b.id.localeCompare(a.id));
   }

   public getPatchVersions(mainVersion: VersionDetails): VersionDetails[] {
      return this.versions
         .filter(v => v.id.startsWith(mainVersion.id.split('.').slice(0, 2).join('.')) && v !== mainVersion)
         .sort((a, b) => a.id.localeCompare(b.id));
   }
}
