// https://leetcode.com/problems/word-ladder/solutions/3356985/rust-dfs-memory-efficient-but-not-time/
use std::collections::HashSet;

impl Solution {
    pub fn ladder_length(begin_word: String, end_word: String, mut word_list: Vec<String>) -> i32 {
        if !word_list.contains(&end_word) {
            return 0
        }
        word_list.push(begin_word.clone());
        let mut set =HashSet::new();
        set.insert(end_word);

        let mut res = 1;
        while !set.is_empty() {
            if set.contains(&begin_word) {
                return res
            }
            let mut new_set = HashSet::new();
            for w1 in set {
                word_list.retain(|w2| {
                    if Self::differnce(&w1, w2) != 1 {
                        return true
                    }
                    new_set.insert(w2.to_owned());
                    false
                });
            }
            set = new_set;
            res += 1;
        }
        0
    }
    pub fn differnce(word1: &str, word2: &str) -> i32 {
        word1.bytes().zip(word2.bytes()).fold(0, |res, (w1, w2)| {
            res + (w2 != w1) as i32
        })
    }
}