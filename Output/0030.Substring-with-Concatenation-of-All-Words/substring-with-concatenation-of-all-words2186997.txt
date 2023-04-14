// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/2186997/rust-window-function-in-rust/
use std::collections::HashMap;

impl Solution {
    pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
        let mut res = Vec::new();
        let mut hp = HashMap::new();
        let n = words.len();
        let m = words[0].len();
        for word in words {
            hp.entry(word).and_modify(|w| *w += 1).or_insert(1);
        }
        for (idx, win) in s
            .chars()
            .collect::<Vec<char>>()
            .as_slice()
            .windows(n * m)
            .enumerate()
        {
            let mut hp_only = hp.clone();
            for word in win.chunks(m) {
                hp_only
                    .entry(word.iter().collect::<String>())
                    .and_modify(|w| *w -= 1);
            }
            if hp_only.into_iter().all(|(_, v)| v == 0) {
                res.push(idx as i32);
            }
        }
        res
    }
}