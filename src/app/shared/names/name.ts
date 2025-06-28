import { JapaneseName } from "./japanese-name";
import { RegularName } from "./regular-name";
import { SyllabicName } from "./syllabic-name";

export type Name = JapaneseName | SyllabicName | RegularName;
