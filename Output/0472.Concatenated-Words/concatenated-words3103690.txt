// https://leetcode.com/problems/concatenated-words/solutions/3103690/rust-recursion/
use std::collections::HashSet;
impl Solution {
    pub fn find_all_concatenated_words_in_a_dict(words: Vec<String>) -> Vec<String> {
        let mut store = HashSet::new();
        for w in &words {
            store.insert(w.clone());
        }

        let mut ans = Vec::new();
        for w in words {
            if Self::foo(0, 0, &w, &store) {
                ans.push(w);
            }
        }

        ans
    }

    fn foo(i: usize, cnt: usize, s: &str, store: &HashSet<String>) -> bool {
        if i == s.len() {
            return cnt > 1;
        }

        for j in i..s.len() {
            if store.contains(&s[i..=j]) && Self::foo(j + 1, cnt + 1, s, store) {
                return true;
            }
        }
        
        false
    }
}