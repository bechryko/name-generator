import { RegularString } from "@ngen-shared/models";
import { AlgorithmDataType } from "./algorithm-data-type";

interface AlgorithmDataTypeMap {
   [AlgorithmDataType.VOID]: undefined;
   [AlgorithmDataType.STRING]: string;
   [AlgorithmDataType.REGULAR_STRING]: RegularString;
}

export abstract class AlgorithmPart<I extends AlgorithmDataType, O extends AlgorithmDataType, C = undefined> {
   public abstract transform(input: AlgorithmDataTypeMap[I], config: C): AlgorithmDataTypeMap[O];

   public abstract getInputType(): I;

   public abstract getOutputType(): O;
}
