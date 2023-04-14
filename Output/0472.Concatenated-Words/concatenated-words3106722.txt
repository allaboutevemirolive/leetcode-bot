// https://leetcode.com/problems/concatenated-words/solutions/3106722/rust-quick-solution-with-hashset-and-backtracking/
use std::collections::HashSet;
use std::str::Chars;
use std::iter::FromIterator;

impl Solution {
     fn check_if_is_concatenated(mut pattern: Chars, prev_match_nr: usize, words_set: &HashSet<String>) -> bool {
        let mut curr_word = String::new();
        loop {
            match pattern.nth(0) {
                Some(c) => {
                    curr_word.push(c);

                    if words_set.contains(&curr_word) {
                        // If we iterator is empty (we took last word) and we have any matches before return hit
                        if pattern.clone().peekable().peek().is_none() && prev_match_nr >= 1 {
                            return true;
                        }
                        else if Self::check_if_is_concatenated(pattern.clone(), prev_match_nr + 1, words_set) {
                            return true;
                        }
                    }
                },
                None => return false
            }
        }
    }

    pub fn find_all_concatenated_words_in_a_dict(words: Vec<String>) -> Vec<String> {
        let mut result = Vec::new();
        let words_set = HashSet::from_iter(words.iter().cloned());

        for w in &words {
            if Self::check_if_is_concatenated(w.chars(), 0, &words_set) {
                result.push(w.clone());
            }
        }
        return result;
    }
}