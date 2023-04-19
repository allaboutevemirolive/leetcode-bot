// https://leetcode.com/problems/regular-expression-matching/solutions/1074505/rust-0ms-runtime-beats-100-using-memoization/

use std::collections::HashMap;

struct Match<'a> {
    s: &'a [u8],
    p: &'a [u8],
    s_len: usize,
    p_len: usize,
    memo: HashMap<[usize; 2], bool>,
}

impl<'a> Match<'a> {
    fn _match(&mut self, i: usize, j: usize) -> bool {
        if let Some(&res) = self.memo.get(&[i, j]) {
            res
        } else {
            if j == self.p_len {
                if i == self.s_len {
                    return true;
                }
            }
            match (i == self.s_len, j == self.p_len) {
                (true, true) => true,
                (false, true) => false,
                _ => {
                    let mut res = false;
                   let m = i < self.s_len && (self.p[j] == b'.' || self.s[i] == self.p[j]);
                    if (j + 1) < self.p_len && self.p[j + 1] == b'*' {
                        res = self._match(i, j + 2) || (m && self._match(i + 1, j));
                    } else if m {
                        res = self._match(i + 1, j + 1);
                    }
                    self.memo.insert([i, j], res);
                    res
                }
            }
        }
    }
}

impl Solution {
    pub fn is_match(s: String, p: String) -> bool {
        let mut matcher = Match {
            s: s.as_bytes(),
            p: p.as_bytes(),
            s_len: s.len(),
            p_len: p.len(),
            memo: HashMap::new(),
        };
        matcher._match(0, 0)
    }
}