// https://leetcode.com/problems/minimum-window-substring/solutions/2142884/rust-solution/
use std::collections::{VecDeque, HashMap};
impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        let s_byte = s.as_bytes();
        let t_byte = t.as_bytes();
        let mut map = HashMap::<u8, i32>::new();
        let mut n_free = t.len() as i32;
        let (mut len, mut pos) = (s.len(), 0);
        for &b in t_byte {
            let count = map.entry(b).or_insert(0);
            *count += 1;
        }
        let mut window = VecDeque::<usize>::new();
        for (i, b) in s_byte.iter().enumerate() {
            if let Some(count) = map.get_mut(b) {
                *count -= 1;
                window.push_back(i);
                if *count >= 0 {
                    n_free -= 1;
                }

                while let Some(&idx) = window.front() {
                    let cur_count = map.get_mut(&s_byte[idx]).unwrap();
                    if *cur_count < 0 {
                        *cur_count += 1;
                        window.pop_front();
                    } else {
                        break;
                    }
                }
                if n_free == 0 {
                    let cur_len = i - *window.front().unwrap();
                    if cur_len < len {
                        len = cur_len;
                        pos = i;
                    }
                }
            }
        }
        if len == s.len() {
            "".to_owned()
        } else {
            String::from(&s[pos - len..pos + 1])
        }
    }
}