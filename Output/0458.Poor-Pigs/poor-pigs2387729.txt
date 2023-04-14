// https://leetcode.com/problems/poor-pigs/solutions/2387729/rust-log/
impl Solution {
    pub fn poor_pigs(buckets: i32, minutes_to_die: i32, minutes_to_test: i32) -> i32 {
        let tests = (minutes_to_test / minutes_to_die + 1) as f32;
        
        // currently, getting the log of an int is
        // unstable in rust so it won't compile unless we use floats
        let buckets = buckets as f32;
        
        let pigs = buckets.log2()  / tests.log2();
        
        (pigs).ceil() as i32
    }
}