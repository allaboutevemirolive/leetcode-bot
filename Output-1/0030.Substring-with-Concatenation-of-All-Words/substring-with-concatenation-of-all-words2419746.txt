// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/2419746/rust-sliding-window/
use std::cell::Cell;
use std::collections::HashMap;

pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
    // All words have the same length according to the
    // problem statement
    let word_len = words[0].len();
    let word_cnt = words.len();

    // If the combined length of all words is greater than the `S` string,
    // then it's not possible to create `S` by concatenating all words
    let substring_len = word_len * word_cnt;
    if s.len() < substring_len {
        return vec![];
    }

    // The words are not necessarily unique, thus a word can
    // appear more than once
    let mut word_count = HashMap::new();
    words.iter().map(|w| w.as_str()).for_each(|w| {
        word_count
            .entry(w)
            .and_modify(|c: &mut Cell<usize>| *c.get_mut() += 1)
            .or_insert(Cell::new(1));
    });

    let mut answer = vec![];

    // Because the word doe snot necessarily start at index 0 of `S`
    // we have to start from all `[0 to word_len]` indexes
    for start in 0..word_len {
        // There are no enough characters to complete the concatenation.
        // And because each iteration, the substring becomes shorter
        // we can stop early
        if start + substring_len > s.len() {
            break;
        }

        // Number of concatenated words we have found
        let mut found = 0;
        // Start of the sliding window
        let mut lo = start;
        // End of the sliding window
        let mut hi = lo + word_len;

        while hi <= s.len() {
            match word_count.get(&s[hi - word_len..hi]) {
                // If this word is not present in the word map,
                // we can just update the start of the sliding window,
                // because we do not have any found words yet
                None if found == 0 => {
                    lo = hi;
                }

                // If the word is not present, but we have found some words,
                // we have to loop over all the words in order to restore their
                // origin al "word count" values
                None => {
                    while lo < hi - word_len {
                        if let Some(cnt) = word_count.get(&s[lo..lo + word_len]) {
                            cnt.set(cnt.get() + 1);
                            found -= 1;
                        }
                        lo += word_len;
                    }
                    // sanity-check - make sure that we have processed all the words
                    assert_eq!(found, 0);

                    lo = hi;
                }

                // We have found a word, but its count is 0. This means
                // that we have to go over all the found words and exclude
                // them from the sliding window (i.e. restore their word counts)
                // until the count for this word becomes 1, which we then
                // immediately set to 0, because we've just matched it.
                Some(cnt) if cnt.get() == 0 => {
                    while cnt.get() == 0 {
                        if let Some(cnt) = word_count.get(&s[lo..lo + word_len]) {
                            cnt.set(cnt.get() + 1);
                            found -= 1;
                        }
                        lo += word_len;
                    }

                    cnt.set(0);
                    found += 1;
                }

                // We have found a word, with non-zero word count. We can
                // just decrement its count and increment the number of
                // found words
                Some(cnt) => {
                    cnt.set(cnt.get() - 1);
                    found += 1;
                }
            }

            // Expand the sliding window
            hi += word_len;

            // We've found a substring, which contains the concatenation
            // of all the words from the dictionary
            if found == word_cnt {
                answer.push(lo as i32);

                // Shrink the sliding window from the left, in order to
                // continue with the search for new valid starting positions
                if let Some(cnt) = word_count.get(&s[lo..lo + word_len]) {
                    cnt.set(cnt.get() + 1);
                }
                lo += word_len;
                found -= 1;
            }
        }

        // We've reached the end of the `S` string. We have to reset the word counters
        // in order to be ready for the next iteration
        while found != 0 && lo < hi {
            if let Some(cnt) = word_count.get(&s[lo..lo + word_len]) {
                cnt.set(cnt.get() + 1);
                found -= 1;
            }
            lo += word_len;
        }
    }

    answer
}