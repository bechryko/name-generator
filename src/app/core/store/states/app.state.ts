import { ConfigurationState } from "@ngen-generation/generation-config/store";
import { AuthState } from "./auth.state";
import { PageState } from "./page.state";

export interface AppState {
   auth: AuthState;
   configuration: ConfigurationState;
   page: PageState;
}
