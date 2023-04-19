// https://leetcode.com/problems/valid-number/solutions/319062/rust-1-line-0-ms-faster-than-100-00/
pub fn is_number(s: String) -> bool { s.trim().parse::<f32>().is_ok() }