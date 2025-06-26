import { RegularString } from "@ngen-shared/models";
import { AlgorithmDataType } from "./algorithm-data-type";
import { GenerationData } from "./generation-data";

interface AlgorithmDataTypeMap {
   [AlgorithmDataType.VOID]: undefined;
   [AlgorithmDataType.REGULAR_STRING_WITH_WILDCARDS]: RegularString;
   [AlgorithmDataType.REGULAR_STRING]: RegularString;
   [AlgorithmDataType.NAME]: string;
}

export abstract class AlgorithmPart<I extends AlgorithmDataType, O extends AlgorithmDataType, C = undefined> {
   public abstract transform(
      input: AlgorithmDataTypeMap[I],
      config: C,
      data: GenerationData
   ): [AlgorithmDataTypeMap[O], GenerationData];

   public abstract getInputType(): I;

   public abstract getOutputType(): O;
}
