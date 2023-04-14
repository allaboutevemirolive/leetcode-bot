// https://leetcode.com/problems/concatenated-words/solutions/1742422/efficient-rust-solution-using-dp/
use std::collections::HashSet;

impl Solution {
    
    fn can_build(s: &str, prev: &HashSet<&str>) -> bool {
        if prev.len() == 0 {
            return false;
        }
        let mut dp: Vec<bool> = vec![false; s.len()+1];
        dp[0] = true;
        for i in 1..=s.len() {
            for j in 0..i {
                if dp[j] {
                    if let Some(_) = prev.get(&s[j..i]) {
                        dp[i] = true;
                        break;
                    }
                }
            }
        }
        return dp[s.len()];
    }
     
    pub fn find_all_concatenated_words_in_a_dict(mut words: Vec<String>) -> Vec<String> {
         // 1. sort strings by length, O(nlogn)
        words.sort_by( |l, r|  l.len().cmp(&r.len()) );
        // 2. iterate over strings and check if you can build it with previously considered strings (smaller length)
        let mut res: Vec<String> = Vec::new();
        let mut previous: HashSet<&str> = HashSet::with_capacity(words.len());
       
        for s in &words {
            if Self::can_build(s, &previous) {
                res.push(s.clone());
            }
            previous.insert(s);
        }
        return res;
    }
}