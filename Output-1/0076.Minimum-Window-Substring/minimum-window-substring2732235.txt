// https://leetcode.com/problems/minimum-window-substring/solutions/2732235/rust-2ptr-approach-with-comments/
use std::collections::HashMap;
impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        if s == t { return s; };
        let (t_len, s_len) = (t.len(), s.len());
        if t_len > s_len { return "".to_string(); };
        
        // add all chars in t to a map (w/ freq. as val)
        let mut map = HashMap::<char, i32>::new();
        for c in t.chars() { *map.entry(c).or_insert(0) += 1; }
        let m_len = map.len();
                
        let (mut accounted_for, mut left, mut right): (usize, usize, usize) = (0, 0, 0);
        let s = s.chars().collect::<Vec<char>>();
        let mut optimal = None;
        
        while left <= right && right < s_len && (optimal.is_none() || right - left + 1 >= t_len) { 
            // the right boundry needs to be accounted for
            // in the map (if it is in t)
            if let Some(r) = map.get_mut(&s[right]) {
                *r -= 1;
                if *r == 0 {
                    accounted_for += 1;
                }
            }
            
            if accounted_for == m_len {
                loop {
                    // if the leftmost value is not in t
                    // then we can do without it
                    if !map.contains_key(&s[left]) {
                        left += 1;
                        continue;
                    }
                    
                    // if the leftmost value is over-represented
                    // in the current window then we
                    // can do without it
                    let l = map.get_mut(&s[left]).unwrap();
                    if *l < 0 { 
                        *l += 1;
                        left += 1;
                        continue;
                    }
                    
                    break;
                }

                optimal = Some(s[left..=right].into_iter().collect::<String>());

                // reduce window size by moving left bound inward by 1
                *map.get_mut(&s[left]).unwrap() += 1;
                left += 1;
                accounted_for -= 1;
            }
            
            // move the left boundry & update it's value
            // in the map if in t & we are moving the left
            // (i.e., we are optimizing)
            if optimal.is_some() && left < s_len {
                if let Some(l) = map.get_mut(&s[left]) {
                    *l += 1;
                    if *l == 1 {
                        accounted_for -= 1;
                    }
                }
                left += 1;
            }
            
            right += 1;            
        }
                
        optimal.unwrap_or("".to_string())
    }
}