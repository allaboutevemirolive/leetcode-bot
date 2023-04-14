// https://leetcode.com/problems/minimum-window-substring/solutions/3074932/rust-sliding-window/
use std::collections::{HashSet, HashMap};

impl Solution {
    pub fn min_window(s: String, t: String) -> String {
        let mut chars_in_window = 0;
        let mut pair = (0, usize::MAX);

        if t.len() > s.len() {
            return String::new();
        }

        let mut chars_map = HashMap::new();
        let mut window = HashMap::new();

        for c in t.chars(){
            *chars_map.entry(c).or_insert(0) += 1;
            window.insert(c, 0);
        }

        let mut i = 0;
        let s = s.chars().collect::<Vec<char>>();

        for (j, c) in s.iter().enumerate(){
            
            if let Some(cnt) = window.get_mut(c){
                *cnt += 1;

                if *cnt == chars_map[c]{

                    chars_in_window += 1;
                }
            }

            while chars_in_window == chars_map.len() && i <= j {

                let c = &s[i];

                if let Some(cnt) = window.get_mut(c){
                    *cnt -= 1;

                    if *cnt + 1 == chars_map[c]{
                        chars_in_window -= 1;
                    }
                }

                get_min(&mut pair, i, j);

                i+=1;
            }
        }

        if (pair.1 == usize::MAX) { return String::new(); };

        s[pair.0..=pair.1].into_iter().cloned().collect::<String>()
    }
}

fn get_min(pair: &mut (usize, usize), i: usize, j: usize){
    if j - i <  (pair.1 - pair.0){
        *pair = (i, j);
    }
}
