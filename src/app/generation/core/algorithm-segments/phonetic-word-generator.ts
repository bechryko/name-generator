import { RandomUtils } from "@ngen-shared/utils";
import {
   phoneticMid,
   phoneticMidSimpleLength,
   phoneticPost,
   phoneticPostSimpleLength,
   phoneticPre,
   phoneticPreSimpleLength,
   phoneticReplacements
} from "../constants";
import { AlgorithmDataType } from "../enums";
import { AlgorithmSegment, GenerationConfig, GenerationData } from "../models";

export type PhoneticWordGeneratorConfig = Pick<GenerationConfig, "minLength" | "maxLength">;

interface PhoneticOptions {
   syllables: number;
   seed: number | string;
   phoneticSimplicity: number;
   compoundSimplicity: number;
   capFirst: boolean;
}

interface PhoneticWordObject {
   word: string;
   numeric: number;
   lastSkippedPre?: boolean;
   lastSkippedPost: boolean;
   opts: PhoneticOptions;
}

/*
 * Phonetic
 * Copyright 2013-2016 Tom Shawver
 * Original GitHub repository: https://github.com/TomFrost/node-phonetic
 */
export class PhoneticWordGenerator extends AlgorithmSegment<
   AlgorithmDataType.VOID,
   AlgorithmDataType.NAME,
   PhoneticWordGeneratorConfig
> {
   /**
    * Generates a new word based on the given options.  For available options,
    * see getOptions.
    *
    * @returns {string} A generated word.
    */
   public override transform(
      _: undefined,
      config: PhoneticWordGeneratorConfig,
      data: GenerationData
   ): [string, GenerationData] {
      const options = this.getOptions(config);

      const wordObj: PhoneticWordObject = {
         numeric: this.getNumericHash(options.seed),
         lastSkippedPost: false,
         word: "",
         opts: options
      };

      for (let syllables = 0; syllables < options.syllables; syllables++) {
         this.addSyllable(wordObj);
      }

      const newData: GenerationData = {
         ...data,
         generationSteps: data.generationSteps + 1
      };
      return [this.postProcess(wordObj), newData];
   }

   public override getInputType(): AlgorithmDataType.VOID {
      return AlgorithmDataType.VOID;
   }

   public override getOutputType(): AlgorithmDataType.NAME {
      return AlgorithmDataType.NAME;
   }

   /**
    * Combines the option defaults with the provided overrides.  Available
    * options are:
    *  - syllables: The number of syllables to put in the resulting word.
    *          Default is 3.
    *  - seed: A string or number with which to seed the generator.  Using the
    *          same seed (with the same other options) will coerce the generator
    *          into producing the same word.  Default is random.
    *  - phoneticSimplicity: The greater this number, the simpler the phonetics.
    *          For example, 1 might produce 'str' while 5 might produce 's' for
    *          the same syllable.  Minimum is 1, default is 5.
    *  - compoundSimplicity: The greater this number, the less likely the
    *          resulting word will sound "compound", such as "ripkuth" instead of
    *          "riputh".  Minimum is 1, default is 5.
    *  - capFirst: true to capitalize the first letter of the word; all lowercase
    *          otherwise.  Default is true.
    *
    * @returns {{syllables, seed, phoneticSimplicity, compoundSimplicity, capFirst}}
    *      An options object.
    */
   private getOptions(config: PhoneticWordGeneratorConfig): PhoneticOptions {
      return {
         syllables: RandomUtils.between(config.minLength, config.maxLength),
         seed: Math.random(),
         phoneticSimplicity: 5,
         compoundSimplicity: 5,
         capFirst: false
      };
   }

   /**
    * Generates a numeric hash based on the input data.
    *
    * @param {string|number} data The string or number to be hashed.
    * @returns {number}
    */
   private getNumericHash(data: string | number): number {
      // modified, source: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
      let hash = 0;
      for (const char of data.toString()) {
         hash = (hash << 5) - hash + char.charCodeAt(0);
         hash |= 0; // Constrain to 32bit integer
      }
      return Math.abs(hash);
   }

   /**
    * Adds a single syllable to the word contained in the wordObj.  A syllable
    * contains, at maximum, a phonetic from each the PRE, MID, and POST phonetic
    * sets.  Some syllables will omit pre or post based on the
    * options.compoundSimplicity.
    *
    * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
    *      word object on which to operate.
    */
   private addSyllable(wordObj: PhoneticWordObject): void {
      const deriv = this.getDerivative(wordObj.numeric);
      const compound = deriv % wordObj.opts.compoundSimplicity == 0;
      const isFirst = wordObj.word === "";
      const preOnFirst = deriv % 6 > 0;

      if ((isFirst && preOnFirst) || wordObj.lastSkippedPost || compound) {
         wordObj.word += this.getNextPhonetic(phoneticPre, phoneticPreSimpleLength, wordObj);
         wordObj.lastSkippedPre = false;
      } else {
         wordObj.lastSkippedPre = true;
      }

      wordObj.word += this.getNextPhonetic(
         phoneticMid,
         phoneticMidSimpleLength,
         wordObj,
         isFirst && wordObj.lastSkippedPre
      );

      if (wordObj.lastSkippedPre || compound) {
         wordObj.word += this.getNextPhonetic(phoneticPost, phoneticPostSimpleLength, wordObj);
         wordObj.lastSkippedPost = false;
      } else {
         wordObj.lastSkippedPost = true;
      }
   }

   /**
    * Gets the next pseudo-random phonetic from a given phonetic set,
    * intelligently determining whether to include "complex" phonetics in that
    * set based on the options.phoneticSimplicity.
    *
    * @param {Array} phoneticSet The array of phonetics from which to choose
    * @param {number} simpleCap The number of 'simple' phonetics at the beginning
    *      of the phoneticSet
    * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
    *      wordObj for which the phonetic is being chosen
    * @param {boolean} [forceSimple] true to force a simple phonetic to be
    *      chosen; otherwise, the function will choose whether to include complex
    *      phonetics based on the derivative of wordObj.numeric.
    * @returns {string} The chosen phonetic.
    */
   private getNextPhonetic(
      phoneticSet: string[],
      simpleCap: number,
      wordObj: PhoneticWordObject,
      forceSimple?: boolean
   ): string {
      const deriv = this.getDerivative(wordObj.numeric);
      const isSimple = (wordObj.numeric + deriv) % wordObj.opts.phoneticSimplicity > 0;
      const cap = isSimple || forceSimple ? simpleCap : phoneticSet.length;
      const phonetic = phoneticSet[wordObj.numeric % cap];

      wordObj.numeric = this.getNumericHash(wordObj.numeric + wordObj.word);

      return phonetic;
   }

   /**
    * Gets a derivative of a number by repeatedly dividing it by 7 and adding the
    * remainders together.  It's useful to base decisions on a derivative rather
    * than the wordObj's current numeric, as it avoids making the same decisions
    * around the same phonetics.
    *
    * @param {number} num A number from which a derivative should be calculated
    * @returns {number} The derivative.
    */
   private getDerivative(num: number): number {
      let derivative = 1;
      while (num !== 0) {
         derivative += num % 7;
         num = Math.floor(num / 7);
      }
      return derivative;
   }

   /**
    * Applies post-processing to a word after it has already been generated.  In
    * this phase, the phoneticReplacements are executed, applying language intelligence
    * that can make generated words more pronounceable.
    *
    * @param {{word, numeric, lastSkippedPre, lastSkippedPost, opts}} wordObj The
    *      word object to be processed.
    * @returns {string} The processed word.
    */
   private postProcess(wordObj: PhoneticWordObject): string {
      for (const toReplace in phoneticReplacements) {
         const toReplaceRegex = new RegExp(toReplace);
         wordObj.word = wordObj.word.replace(toReplaceRegex, phoneticReplacements[toReplace]);
      }

      return wordObj.word;
   }
}
