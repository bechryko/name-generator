import { LetterUtils } from "./letter.utils";

export class RegularUtils {
    private static readonly basic = ['+', '-', '*'] as const;
    private static readonly numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const;

    public static isRegular(letter: string): boolean {
        return this.basic.includes(letter as any) || this.isReference(letter);
    }

    public static isReference(letter: string): boolean {
        return this.numbers.includes(letter as any);
    }

    public static dereference(name: string, reference: typeof this.numbers[number]): string {
        const index = Number(reference);
        if(name.length < index) {
            throw new Error("invalid regular reference");
        }
        return name[index];
    }

    public static matchRegular(regular: string, pureRegularToMatch: string): boolean {
        const pureRegular = this.convertToPureRegular(regular);
        for(let i = 0; i < pureRegular.length; i++) {
            if(pureRegular[i] === pureRegularToMatch[i]) {
                continue;
            }
            if(pureRegular[i] === '*' || pureRegularToMatch[i] === '*') {
                continue;
            }
            return false;
        }
        return true;
    }

    private static convertToPureRegular(regular: string): string {
        let pureRegular = "";
        for(let i = 0; i < regular.length; i++) {
            if(this.isReference(regular[i])) {
                pureRegular += this.dereference(pureRegular, regular[i] as any);
            } else if(LetterUtils.is('vowel', regular[i])) {
                pureRegular += '+';
            } else if(LetterUtils.is('consonant', regular[i])) {
                pureRegular += '-';
            } else {
                pureRegular += regular[i];
            } 
        }
        return pureRegular;
    }

    public static get allSymbols() {
        return [...this.basic, ...this.numbers];
    }
}
