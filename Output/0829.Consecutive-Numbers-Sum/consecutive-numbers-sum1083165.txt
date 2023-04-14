// https://leetcode.com/problems/consecutive-numbers-sum/solutions/1083165/rust-one-liner-100/
impl Solution {
    pub fn consecutive_numbers_sum(n: i32) -> i32 {
        (1..).take_while(|&i| i * i < n * 2).filter(|&i| if i % 2 == 0 { n % i != 0 && (2 * n) % i == 0} else { n % i == 0}).count() as i32
    }
}