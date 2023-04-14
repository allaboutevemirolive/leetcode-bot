// https://leetcode.com/problems/count-unique-characters-of-all-substrings-of-a-given-string/solutions/2221291/rust-o-n-time-o-1-space/
impl Solution {
    pub fn unique_letter_string(s: String) -> i32 {
        use std::collections::HashMap;
        
        let len = s.len() as i32;
        let mut left = HashMap::new();
        let mut pos = HashMap::new();
        
        let mut res = 0;
        
        for (i, ch) in s.chars().enumerate() {
            if let Some(mid) = pos.insert(ch, i as i32) {
                let left_dis = mid - left.insert(ch, mid).unwrap_or(-1);
                let right_dis = i as i32 - mid;
                res += left_dis * right_dis;
            }
        }
        
        for ch in 'A'..='Z' {
            if let Some(&mid) = pos.get(&ch) {
                res += (len - mid) * (mid - *left.get(&ch).unwrap_or(&-1));
            }
        }
        res
    } 
}