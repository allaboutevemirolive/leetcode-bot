// https://leetcode.com/problems/longest-valid-parentheses/solutions/2071079/rust-2-1-mb-0ms/
impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
        /*
            Time Complexity: O(n), Single traversal of String
            Space Complexity: O(n), DP  array of size of n is used 
        */
        let mut stack = vec![-1];
        let mut ans = 0;
        
        for (i, ch) in s.char_indices() { 
            match ch {
                '(' => stack.push(i as i32),
                _  => { 
                    stack.pop();
                    if stack.is_empty() { 
                        stack.push(i as i32); 
                    } else { 
                        if let Some(peek) = stack.last() { 
                            ans = i32::max(ans, i as i32 - peek);
                            // println!("{stack:?}")
                        }
                    }
                }
            }
        }
        ans
    }
}