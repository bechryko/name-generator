import { RandomUtils } from "@ngen-core/utils";
import { Letter, RandomLetterConfig } from "../models";

type LetterType = 'vowel' | 'consonant' | 'letter';

export class LetterUtils {
    private static readonly vowel: Letter[] = [
        { letter: 'a', weight: 43.31 },
        { letter: 'e', weight: 56.88 },
        { letter: 'i', weight: 38.45 },
        { letter: 'o', weight: 36.51 },
        { letter: 'u', weight: 18.51 }
    ];
    private static readonly consonant: Letter[] = [
        { letter: 'b', weight: 10.56 },
        { letter: 'c', weight: 23.13 },
        { letter: 'd', weight: 17.25 },
        { letter: 'f', weight: 9.24 },
        { letter: 'g', weight: 12.59 },
        { letter: 'h', weight: 15.31 },
        { letter: 'j', weight: 1 },
        { letter: 'k', weight: 5.61 },
        { letter: 'l', weight: 27.98 },
        { letter: 'm', weight: 15.36 },
        { letter: 'n', weight: 33.92 },
        { letter: 'p', weight: 16.14 },
        { letter: 'q', weight: 1 },
        { letter: 'r', weight: 38.64 },
        { letter: 's', weight: 29.23 },
        { letter: 't', weight: 35.43 },
        { letter: 'v', weight: 5.13 },
        { letter: 'w', weight: 6.57 },
        { letter: 'x', weight: 1.48 },
        { letter: 'y', weight: 9.06 },
        { letter: 'z', weight: 1.39 }
    ];
    private static readonly letter = this.vowel.concat(this.consonant).sort((a, b) => a.letter.localeCompare(b.letter));

    public static random(type: LetterType, config: RandomLetterConfig = {}): string {
        let array = this[type];
        if(config.excluded) {
            array = array.filter(l => !config.excluded!.includes(l.letter));
        }
        if(config.included) {
            array = array.filter(l => config.included!.includes(l.letter));
        }
        return RandomUtils.randomIndexWeighted(
            array.map(l => l.letter),
            array.map(l => l.weight)
        );
    }

    public static numberOf(type: LetterType, name?: string): number {
        if(!name) {
            return this[type].length;
        }
        return name.split('').filter(l => this.is(type, l)).length;
    }

    public static is(type: LetterType, letter: string): boolean {
        return this[type].map(l => l.letter).includes(letter);
    }
}
