// https://leetcode.com/problems/longest-valid-parentheses/solutions/3397923/two-rust-solutions-stack-double-iteration/
impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
        let mut result = 0;
        let mut stack : Vec<i32> = vec![-1];
        for i in 0..s.len() {
            if s.chars().nth(i) == Some('(') {
                stack.push(i as i32);
            }
            else {
                stack.pop().unwrap();
                if stack.is_empty() {
                    stack.push(i as i32);
                }
                else {
                    result = std::cmp::max(result, i as i32 - stack.last().unwrap());
                }
            }
        }
        result
    }
}