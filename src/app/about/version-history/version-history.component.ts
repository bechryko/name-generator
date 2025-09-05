import { ChangeDetectionStrategy, Component } from "@angular/core";

interface VersionDetails {
   id: string;
   date?: Date;
   content: string[];
}

@Component({
   selector: "ngen-version-history",
   templateUrl: "./version-history.component.html",
   styleUrl: "../styles/about-content.scss",
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class VersionHistoryComponent {
   private readonly versions: VersionDetails[] = [
      {
         id: "1.0",
         content: [
            "Added Japanese generator algorithm",
            "Added syllabic generator algorithm",
            "Added regular generator algorithm",
            "Added phonetic generator algorithm by Tom Shawver",
            "Added 10 generation config fields",
            "Introduced letter set inputs",
            "Introduced regular string inputs and a name generation-specific regular language",
            "Added bulk generation dialog",
            "Added About page with introduction, generator descriptions and version history"
         ]
      }
   ];

   public get namedVersions(): VersionDetails[] {
      return this.versions.sort((a, b) => b.id.localeCompare(a.id));
   }

   public getPatchVersions(mainVersion: VersionDetails): VersionDetails[] {
      return this.versions
         .filter(v => v.id.startsWith(mainVersion.id.split(".").slice(0, 2).join(".")) && v !== mainVersion)
         .sort((a, b) => a.id.localeCompare(b.id));
   }
}
