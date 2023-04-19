// https://leetcode.com/problems/longest-valid-parentheses/solutions/1371090/rust-stack-solution/
impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
        let mut stack = vec![-1];
        let mut max = 0;
        
        for (index, ch) in s.chars().enumerate() {
            let index = index as i32;
            match ch {
                '(' => { stack.push(index); },
                ')' => {
                    stack.pop();
                    if stack.is_empty() {
                        stack.push(index);
                    } else {
                        max = std::cmp::max(max, index - stack.last().unwrap());
                    }
                },
                _ => (),
            }
        }
        max
    }
}