// https://leetcode.com/problems/valid-number/solutions/680824/easy-rust-solution-small-code/
pub fn is_number(s: String) -> bool {
    s.trim().parse::<f64>().is_ok()
}