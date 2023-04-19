// https://leetcode.com/problems/minimum-window-substring/solutions/2383825/rust-solution-sliding-window/
use std::collections::HashMap;

impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        let total = t.len();
        let (s, t) = (s.as_bytes(), t.as_bytes());
        let mut t_map = HashMap::new();
        for c in t.iter() {
            *t_map.entry(c).or_insert(0) += 1;
        }
        
        let mut count = 0;
        let mut start = 0;
        let mut min_len = s.len() + 1;
        let mut min_str: &[u8] = &[];
        for (idx, c) in s.iter().enumerate() {
            *t_map.entry(c).or_insert(0) -= 1;
            if *t_map.get(c).unwrap() >= 0 {
                count += 1;
            }
            
            while count == total {
                if min_len > idx - start + 1 {
                    min_len = idx - start + 1;
                    min_str = &s[start..idx + 1];
                }
                *t_map.get_mut(&s[start]).unwrap() += 1;
                if *t_map.get(&s[start]).unwrap() > 0 {
                    count -= 1;
                }
                start += 1;
            }
        }
        std::str::from_utf8(min_str).unwrap().to_owned()
    }
}
