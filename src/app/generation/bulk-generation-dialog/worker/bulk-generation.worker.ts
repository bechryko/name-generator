/// <reference lib="webworker" />

import { BulkGenerationWorkerData } from "../models";
import { BulkGenerationWorkerUtils } from "./bulk-generation.worker.utils";

addEventListener("message", ({ data }: { data: BulkGenerationWorkerData }) => {
   postMessage(BulkGenerationWorkerUtils.generate(data));
});
