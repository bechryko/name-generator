import { ChangeDetectionStrategy, Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AboutSubpages } from "@ngen-about/about-subpages";

@Component({
   selector: "ngen-introduction",
   templateUrl: "./introduction.component.html",
   styleUrl: "../styles/about-content.scss",
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [RouterLink]
})
export class IntroductionComponent {
   public readonly subpages = AboutSubpages;
}
