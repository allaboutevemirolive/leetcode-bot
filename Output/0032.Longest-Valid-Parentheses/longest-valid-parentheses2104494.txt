// https://leetcode.com/problems/longest-valid-parentheses/solutions/2104494/rust-0-ms-solution/
   pub fn longest_valid_parentheses(s: String) -> i32 {
        let mut valid = vec![0; s.len() + 1];
        let s = s.as_bytes();
        for (i, &c) in s.iter().enumerate() {
            if c == b'(' {
                continue;
            }
            if let Some(idx) = i.checked_sub(valid[i] + 1) {
                if s[idx] == b'(' {
                    valid[i + 1] = valid[i] + 2 + valid[idx];
                }
            }
        }
        valid.into_iter().max().unwrap_or(0) as i32
    }