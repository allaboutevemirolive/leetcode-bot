// https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/solutions/689820/rust-1-pass-6-lines-0ms/
impl Solution {
    pub fn max_profit(ps: Vec<i32>) -> i32 {
        let (mut b1, mut b2, mut p1, mut p2) = (i32::min_value(), i32::min_value(), 0, 0);
        for p in ps {
            b1 = max(b1, -p);
            p1 = max(p1, p + b1);
            b2 = max(b2, p1 - p);
            p2 = max(p2, b2 + p);
        }
        p2
    }
}