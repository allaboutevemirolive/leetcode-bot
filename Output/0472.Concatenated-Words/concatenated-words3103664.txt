// https://leetcode.com/problems/concatenated-words/solutions/3103664/rust-hashset-bottom-up-dp/
use std::collections::HashSet;

impl Solution {
    pub fn find_all_concatenated_words_in_a_dict(words: Vec<String>) -> Vec<String> {
        let hash: HashSet<&str> = words.iter().map(|s| s.as_str()).collect();
        let mut ans = Vec::new();
        for s in words.iter() {
            let mut dp = vec![false; s.len() + 1];
            dp[0] = true;
            for i in 1..s.len() + 1 {
                let left = if i == s.len() { 1 } else { 0 }; // avoid the case of &s[j..i] == &s[..]
                for j in left..i { // instead of for j in 0..i
                    if hash.contains(&s[j..i]) && dp[j] {
                        dp[i] = true;
                        break;
                    }
                }
            }
            if dp[s.len()] {
                ans.push(s.to_owned());
            }
        }
        ans
    }
}