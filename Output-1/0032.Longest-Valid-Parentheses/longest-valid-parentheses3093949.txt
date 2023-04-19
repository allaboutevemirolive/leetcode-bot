// https://leetcode.com/problems/longest-valid-parentheses/solutions/3093949/longest-valid-parentheses-using-rust/
use std::cmp;

impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
        let mut max_length: i32 = 0;
        let mut stack = vec![-1];

        for (i, c) in s.char_indices() {
            if c == ')' {
                stack.pop();

                if stack.is_empty() { 
                    stack.push(i as i32);
                }
               else {
                    if let Some(peek) = stack.last() { 
                        max_length = cmp::max(max_length, i as i32 - peek);
                    }
               }
            }
            else {
                stack.push(i as i32)
            }
        }
        max_length
    }
}