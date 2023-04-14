// https://leetcode.com/problems/minimum-window-substring/solutions/2338507/rust-simple-solution/
use std::collections::HashMap;
impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        let s = s.as_bytes();
        let hm = t.bytes().fold(HashMap::new(), |mut acc, c| {
            *acc.entry(c).or_insert(0) += 1; acc
        });
       
        let mut left = 0; 
        let mut char_count = HashMap::new();
        let mut left_cnt = t.len();
        let mut res: &[u8] = &[]; 
        
        for (right, b) in s.iter().enumerate() {
            if !hm.contains_key(b) {
                continue;
            }
            let v = char_count.entry(*b).and_modify(|e| *e += 1).or_insert(1);
            if *v <= hm[b] {
                left_cnt -= 1;
            }

            if left_cnt == 0 {
                while !hm.contains_key(&s[left]) || char_count[&s[left]] > hm[&s[left]] {
                    *char_count.get_mut(&s[left]).unwrap_or(&mut 1) -= 1;
                    left += 1;
                }
                if res.len() == 0 || right - left + 1 < res.len() {
                    res = &s[left..right + 1];
                }
                *char_count.get_mut(&s[left]).unwrap() -= 1;
                left += 1;
                left_cnt += 1;
            }
        }
        String::from_utf8(res.to_owned()).unwrap()
    }
}