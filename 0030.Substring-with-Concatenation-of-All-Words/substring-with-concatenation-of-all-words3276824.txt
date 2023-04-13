// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/3276824/rust-sliding-window-10ms/
use std::collections::HashMap;

impl Solution {
    pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
        let n = s.len();
        let m = words.len();
        let w = words[0].len();

        let need = words.iter().fold(HashMap::new(), |mut acc, word| {
            *acc.entry(&word[..]).or_insert(0) += 1;
            acc
        });

        let mut res = vec![];
        // offset
        for i in 0..w {
            let mut need = need.clone();
            let mut valid = 0;
            // build the window word by word
            for j in (i..n - w + 1).step_by(w) {
                // j is the left bound of the word, right bound of the window
                let curr = &s[j..j + w];
                if let Some(val) = need.get(curr) {
                    if *val > 0 { valid += 1; }
                }
                *need.entry(curr).or_default() -= 1;
                // shrink the window
                if j >= m * w {
                    let idx = j - m * w;
                    let prev = &s[idx..idx + w];
                    let num = need.entry(prev).or_default();
                    *num += 1;
                    if *num > 0 { valid -= 1; }
                }
                if valid == m {
                    res.push((j + w - m * w) as _)
                }
            }
        }
        res
    }
}