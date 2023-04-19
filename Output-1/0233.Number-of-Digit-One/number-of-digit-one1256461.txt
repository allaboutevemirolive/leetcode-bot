// https://leetcode.com/problems/number-of-digit-one/solutions/1256461/adapted-c-solution-to-rust/
impl Solution {
    pub fn count_digit_one(n: i32) -> i32 {
        let m: i128 = n as i128;
        let mut counter: i128 = 0;
        let mut i: i128 = 1;
        
        while i <= m {
            let divider: i128 = i * 10;
            counter += (m / divider) * i + std::cmp::min(std::cmp::max(m % divider - i + 1, 0), i);
            i *= 10;
        }
        return counter as i32;
    }
}