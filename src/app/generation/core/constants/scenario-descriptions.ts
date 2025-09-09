import { ScenarioDescription } from "../models";

export const scenarioDescriptions: ScenarioDescription[] = [
   { scenario: "+?*--", resolution: "consonant" },
   { scenario: "-?*++", resolution: "vowel" },
   { scenario: "--?", resolution: "vowel" },
   { scenario: "?--", resolution: "vowel" },
   { scenario: "++?", resolution: "consonant" },
   { scenario: "?++", resolution: "consonant" }
];
