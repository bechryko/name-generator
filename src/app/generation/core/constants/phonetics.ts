/**
 * Phonetics that sound best before a vowel.
 */
export const phoneticPre = [
   // Simple phonetics
   "b",
   "c",
   "d",
   "f",
   "g",
   "h",
   "j",
   "k",
   "l",
   "m",
   "n",
   "p",
   "qu",
   "r",
   "s",
   "t",
   // Complex phonetics
   "bl",
   "ch",
   "cl",
   "cr",
   "dr",
   "fl",
   "fr",
   "gl",
   "gr",
   "kl",
   "kr",
   "ph",
   "pr",
   "pl",
   "sc",
   "sh",
   "sl",
   "sn",
   "sr",
   "st",
   "str",
   "sw",
   "th",
   "tr",
   "br",
   "v",
   "w",
   "y",
   "z"
];

/**
 * The number of simple phonetics within the 'pre' set.
 */
export const phoneticPreSimpleLength = 16;

/**
 * Vowel sound phonetics.
 */
export const phoneticMid = [
   // Simple phonetics
   "a",
   "e",
   "i",
   "o",
   "u",
   // Complex phonetics
   "ee",
   "ie",
   "oo",
   "ou",
   "ue"
];

/**
 * The number of simple phonetics within the 'mid' set.
 */
export const phoneticMidSimpleLength = 5;

/**
 * Phonetics that sound best after a vowel.
 */
export const phoneticPost = [
   // Simple phonetics
   "b",
   "d",
   "f",
   "g",
   "k",
   "l",
   "m",
   "n",
   "p",
   "r",
   "s",
   "t",
   "y",
   // Complex phonetics
   "ch",
   "ck",
   "ln",
   "nk",
   "ng",
   "rn",
   "sh",
   "sk",
   "st",
   "th",
   "x",
   "z"
];

/**
 * The number of simple phonetics within the 'post' set.
 */
export const phoneticPostSimpleLength = 13;

/**
 * A mapping of regular expressions to replacements, which will be run on the
 * resulting word before it gets returned.  The purpose of replacements is to
 * address language subtleties that the phonetic builder is incapable of
 * understanding, such as 've' more pronounceable than just 'v' at the end of
 * a word, 'ey' more pronounceable than 'iy', etc.
 */
export const phoneticReplacements: Record<string, string> = {
   quu: "que",
   "qu([aeiou]){2}": "qu$1",
   "[iu]y": "ey",
   eye: "ye",
   "(.)ye$": "$1y",
   "(^|e)cie(?!$)": "$1cei",
   "([vz])$": "$1e",
   "[iu]w": "ow"
};
