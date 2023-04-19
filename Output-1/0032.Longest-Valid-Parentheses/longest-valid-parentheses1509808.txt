// https://leetcode.com/problems/longest-valid-parentheses/solutions/1509808/rust-forward-backward-o-n/
use std::cmp::max;
use std::cmp::min;

impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
        let s_bytes = s.as_bytes();
        let mut longest: u16 = u16::MIN;
        let mut opens: u16 = 0;
        let mut closes: u16 = 0;
        let mut indicator: i16 = 0;
        for &byte in s_bytes {
            if byte == '(' as u8 {
                opens += 1;
                indicator += 1;
            } else {
                closes += 1;
                indicator -= 1;
                if indicator < 0 {
                    indicator = 0;
                    opens = 0;
                    closes = 0;
                } else if indicator == 0 {
                    longest = max(longest, min(opens, closes)*2);
                }
            }
        }
        
        opens = 0;
        closes = 0;
        indicator = 0;
        for i in (0..s_bytes.len()).rev() {
            let byte = s_bytes[i];
            if byte == ')' as u8 {
                opens += 1;
                indicator += 1;
            } else {
                closes += 1;
                indicator -= 1;
                if indicator < 0 {
                    indicator = 0;
                    opens = 0;
                    closes = 0;
                } else if indicator == 0 {
                    longest = max(longest, min(opens, closes)*2);
                }
            }
        }
        
        longest as i32
    }
}