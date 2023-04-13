// https://leetcode.com/problems/scramble-string/solutions/3358524/rust-memoization/
use std::collections::HashMap;

impl Solution {
    pub fn is_scramble(s1: String, s2: String) -> bool {
        let mut memo = HashMap::new();
        Self::recur(&s1[..], &s2[..], &mut memo)
    }

    fn recur<'a>(s1: &'a str, s2: &'a str, m: &mut HashMap<(&'a str, &'a str), bool>) -> bool {
        if s1 == s2 {
            return true;
        }
        if m.contains_key(&(s1, s2)) {
            return m[&(s1, s2)];
        }
        if s1.len() == 1 {
            return false;
        }
        let len = s1.len();

        for i in 1..len {
            if (Self::recur(&s1[..i], &s2[len-i..], m) && Self::recur(&s1[i..], &s2[..len-i], m)) ||
            (Self::recur(&s1[i..], &s2[i..], m) && Self::recur(&s1[..i], &s2[..i], m)) {
                m.insert((s1, s2), true);
                return true;
            } else {
                m.insert((s1, s2), false);
            }
        }

        false
    }
}