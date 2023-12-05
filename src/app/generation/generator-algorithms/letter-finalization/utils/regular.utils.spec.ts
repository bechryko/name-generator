import { RegularUtils } from ".";

describe('RegularUtils', () => {
    describe('matchRegular', () => {
        it('should correctly match regular symbols', () => {
            const regular = "**-+";
            const regularToMatch = "++-*";
            expect(RegularUtils.matchRegular(regular, regularToMatch)).toEqual("++-+");
        });

        it('should correctly match regulars with letters', () => {
            const regular = "a**-+";
            const regularToMatch = "+*+-a";
            expect(RegularUtils.matchRegular(regular, regularToMatch)).toEqual("a*+-a");
        });

        it('should not match regulars with references', () => {
            const regular = "*0-+";
            const regularToMatch = "+*-*";
            expect(RegularUtils.matchRegular(regular, regularToMatch)).toEqual(false);
        });
    });
});
