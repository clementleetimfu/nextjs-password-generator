// EFF Long Wordlist (7776 words)
// Source: https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt

import { effWordlistText } from './eff-wordlist-content'

// Parse the wordlist text file into an array of words
// Format: "11111\tabacus" (dice number + tab + word)
const parseWordlist = (text: string): string[] => {
  return text
    .split('\n')
    .filter((line: string) => line.trim().length > 0)
    .map((line: string) => {
      const parts = line.split('\t')
      return parts[1] || parts[0] // Return the word (second column), fallback to first column
    })
}

export const EFF_LONG_WORDLIST = parseWordlist(effWordlistText)

// Verify wordlist has correct number of words
if (EFF_LONG_WORDLIST.length !== 7776) {
  throw new Error(
    `EFF Long Wordlist must have exactly 7776 words, but has ${EFF_LONG_WORDLIST.length}`
  )
}
