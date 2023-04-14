// https://leetcode.com/problems/longest-valid-parentheses/solutions/1404482/rust-solution/
impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
        let s: Vec<char> = s.chars().collect();
        let mut stack: Vec<i32> = vec![-1];
        let mut res = 0;

        for i in 0..s.len() {
            if s[i] == '(' {
                stack.push(i as i32);
            } else if s[i] == ')' {
                stack.pop();
                if stack.len() == 0 {
                    stack.push(i as i32);
                } else {
                    res = res.max(i as i32 - stack[stack.len() - 1])
                }
            } else {
                unreachable!();
            }
        }

        res
    }
}
