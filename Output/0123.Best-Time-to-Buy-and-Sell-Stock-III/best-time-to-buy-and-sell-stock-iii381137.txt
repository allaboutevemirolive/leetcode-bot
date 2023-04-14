// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/solutions/381137/0ms-rust-o-n/
use std::cmp::{min, max};

impl Solution {
    pub fn max_profit(prices: Vec<i32>) -> i32 {
        if prices.is_empty() {
            return 0;
        }
        let n = prices.len();
        let (mut fwd, mut bwd) = (vec![0; n], vec![0; n]);
        let (mut b, mut s) = (std::i32::MAX, 0);
        prices.iter().enumerate().for_each(|(i, p)| {
            fwd[i] = if i == 0 { 0 } else { max(fwd[i-1], p-b) };
            b = min(b, *p);
        });
        (0..n).rev().for_each(|i| {
            let p = prices[i];
            bwd[i] = if i == n-1 { 0 } else { max(bwd[i+1], s-p) };
            s = max(s, p);
        });
        (0..n).fold(0, |acc, i| max(fwd[i] + bwd[i], acc))
    }
}