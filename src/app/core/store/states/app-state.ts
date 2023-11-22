import { ConfigurationState } from "@ngen-generation/generation-config/store";
import { PageState } from "./page-state";

export interface AppState {
   configuration: ConfigurationState;
   page: PageState;
}
