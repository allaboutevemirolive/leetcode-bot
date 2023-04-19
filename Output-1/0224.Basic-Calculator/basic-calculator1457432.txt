// https://leetcode.com/problems/basic-calculator/solutions/1457432/rust-recursive-solution/
use std::str::Bytes;

#[derive(PartialEq)]
enum Op {
    Add,
    Sub,
}

impl Solution {
    pub fn calculate(s: String) -> i32 {
        Solution::helper(&mut s.bytes())
    }
    fn helper(iter: &mut Bytes) -> i32 {
        let mut ret = 0;
        let mut op = Op::Add;
        let mut n = 0;
        while let Some(u) = iter.next() {
            match u {
                b'+' | b'-' => {
                    ret += if op == Op::Add { n } else { -n };
                    op = if u == b'+' { Op::Add } else { Op::Sub };
                    n = 0;
                }
                b'0'..=b'9' => n = n * 10 + (u - b'0') as i32,
                b'(' => n = Self::helper(iter),
                b')' => break,
                _ => {}
            }
        }
        ret + if op == Op::Add { n } else { -n }
    }
}