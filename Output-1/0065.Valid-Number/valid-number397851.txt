// https://leetcode.com/problems/valid-number/solutions/397851/rust-1-liner/
impl Solution {
    pub fn is_number(s: String) -> bool {
        s.trim().parse::<f64>().is_ok()
    }
}