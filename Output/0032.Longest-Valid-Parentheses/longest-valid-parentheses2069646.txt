// https://leetcode.com/problems/longest-valid-parentheses/solutions/2069646/rust-o-n-o-1-concise/
use std::cmp::Ordering;

impl Solution {
    pub fn longest_valid_parentheses(s: String) -> i32 {
        fn f<'a>(bytes: impl Iterator<Item = &'a u8>, left_delimiter: u8) -> i32 {
            bytes
                .fold((0, 0, 0), |(mut left, mut right, max), c| {
                    if *c == left_delimiter {
                        left += 1
                    } else {
                        right += 1
                    }
                    match left.cmp(&right) {
                        Ordering::Equal => (left, right, max.max(2 * right)),
                        Ordering::Less => (0, 0, max),
                        _ => (left, right, max),
                    }
                })
                .2
        }

        f(s.as_bytes().iter(), b'(').max(f(s.as_bytes().iter().rev(), b')'))
    }
}