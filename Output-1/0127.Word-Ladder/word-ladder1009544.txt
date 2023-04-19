// https://leetcode.com/problems/word-ladder/solutions/1009544/unsafe-rust-bfs-runtime-beats-95/
use std::collections::HashSet;
use std::collections::VecDeque;

impl Solution {
    pub fn ladder_length(begin_word: String, end_word: String, word_list: Vec<String>) -> i32 {
        let mut word_set: HashSet<String> = word_list.into_iter().collect();
        if !word_set.contains(&end_word) {
            return 0;
        }
        
        let mut q: VecDeque<(String, i32)> = vec![(begin_word, 1)].into_iter().collect();
        
        while let Some((mut cur_str, depth)) = q.pop_front() {
            if cur_str == end_word {
                return depth;
            }
            
            let mut u8arr: &mut [u8] = unsafe {
                &mut *(cur_str.as_bytes_mut() as *mut _)
            };
            let original = cur_str.as_bytes();
            
            for i in 0..u8arr.len() {
                let original_c = u8arr[i];
                
                for c in ('a' as u8)..=('z' as u8) {
                    if c != original[i] {
                        u8arr[i] = c;
                        if let Some(next_str) = word_set.take(&cur_str) {
                            q.push_back((next_str, depth + 1));
                        }
                    }    
                }
                
                u8arr[i] = original_c;
            }  
        }
        
        return 0;
    }
}