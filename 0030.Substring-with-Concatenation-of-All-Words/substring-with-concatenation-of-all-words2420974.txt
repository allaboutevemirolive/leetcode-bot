// https://leetcode.com/problems/substring-with-concatenation-of-all-words/solutions/2420974/rust-u8-sliding-window-histogram-hashmap/
use std::collections::HashMap;

impl Solution {
    pub fn find_substring(s: String, words: Vec<String>) -> Vec<i32> {
        let s = s.into_bytes();
        let n = words.len();
        let w = words[0].len();
        let window_size = n * w;

        if s.len() < window_size {
            return vec![];
        }

        let (words, count) = words.into_iter().map(|s| s.into_bytes()).fold(
            (HashMap::<Vec<u8>, i32>::new(), [0; 26]),
            |mut acc, s| {
                for (i, v) in Self::get_count(&s).iter().enumerate() {
                    acc.1[i] += v;
                }
                *acc.0.entry(s).or_default() += 1;
                acc
            },
        );

        let mut indices = vec![];

        let mut current_count = Self::get_count(&s[..window_size]);
        current_count[(&s[window_size - 1] - b'a') as usize] -= 1;
        for i in 0..=(s.len() - window_size) {
            current_count[(&s[i + window_size - 1] - b'a') as usize] += 1;
            
            if current_count == count {
                let map = &s[i .. i + window_size].chunks(w).fold(HashMap::<Vec<u8>, i32>::new(), |mut acc, s| {
                    *acc.entry(s.to_vec()).or_default() += 1;
                    acc
                });

                if map == &words {
                    indices.push(i as i32);
                }
            }

            current_count[(&s[i] - b'a') as usize] -= 1;
        }

        indices
    }

    fn get_count(s: &[u8]) -> [i32; 26] {
        s.iter().fold([0; 26], |mut acc, c| {
            acc[(c - b'a') as usize] += 1;
            acc
        })
    }
}
