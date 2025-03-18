import { AboutSubpages } from "@ngen-about/about-subpages";
import { Generators } from "@ngen-generation/enums";

export interface PageState {
   generator: Generators;
   aboutSubpage: AboutSubpages;
}
