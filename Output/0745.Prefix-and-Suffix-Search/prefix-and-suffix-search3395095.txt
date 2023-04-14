// https://leetcode.com/problems/prefix-and-suffix-search/solutions/3395095/rust-using-hashmap-beats-80/
use std::collections::{HashMap, HashSet};
use std::str::{Bytes, Chars};


struct WordFilter {
    prefixes: HashMap<String, HashSet<u16>>,
    suffixes: HashMap<String, HashSet<u16>>,
}

impl WordFilter {
        fn new(words: Vec<String>) -> Self {
        let words: HashMap<String, i32> = words
            .into_iter()
            .enumerate()
            .map(|(idx, word)| (word, idx as i32))
            .collect();

        let mut prefixes: HashMap<String, HashSet<u16>> = HashMap::new();

        for (word, &word_idx) in words.iter() {
            for pref_len in 1..=7 {
                if word.len() < pref_len {
                    continue;
                }

                let prefix: String = word.chars().take(pref_len).collect();

                prefixes.entry(prefix).or_default().insert(word_idx as u16);
            }
        }

        let mut suffixes: HashMap<String, HashSet<u16>> = HashMap::new();

        for (word, &word_idx) in words.iter() {
            for suff_len in 1..=7 {
                if word.len() < suff_len {
                    continue;
                }

                let suffix: String = word
                    .bytes()
                    .skip(word.len() - suff_len)
                    .map(|byte| byte as char)
                    .collect();

                suffixes.entry(suffix).or_default().insert(word_idx as u16);
            }
        }

        Self { prefixes, suffixes }
    }

    fn f(&self, pref: String, suff: String) -> i32 {
        let prefix_set = self.prefixes.get(&pref).cloned().unwrap_or_default();
        let suffix_set = self.suffixes.get(&suff).cloned().unwrap_or_default();

        let common_set = prefix_set.intersection(&suffix_set);

        common_set.max().cloned().map(i32::from).unwrap_or(-1)
    }
}