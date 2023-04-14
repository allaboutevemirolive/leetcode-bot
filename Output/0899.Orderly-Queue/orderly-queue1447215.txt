// https://leetcode.com/problems/orderly-queue/solutions/1447215/another-rust-solution/
use std::cmp;
impl Solution {
    pub fn orderly_queue(s: String, k: i32) -> String {
        if k == 1 {
            let mut res = s.clone();
            let double: String = [s.clone(), s.clone()].join(""); 
            for i in 0..s.len() {
                let tmp = &double[i..i + s.len()];
                let tmp : String = tmp.into();
                res = cmp::min(res, tmp).clone();
            }
            
            res
        } else {
            let mut characters: Vec<char> = s.chars().collect();
            characters.sort();
            
            characters.iter().collect()
        }   
    }
}