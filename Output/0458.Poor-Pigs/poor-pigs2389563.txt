// https://leetcode.com/problems/poor-pigs/solutions/2389563/rust-0ms-100-combinatorics-solving-simple-equation/
impl Solution {
    pub fn poor_pigs(buckets: i32, minutes_to_die: i32, minutes_to_test: i32) -> i32 {
        let tests_num = (minutes_to_test / minutes_to_die) as f64;
		// solving for (number_of_tests + 1) ^ min_pigs >= buckets
        let min_pigs  = (buckets as f64).log(tests_num+1.0);
        min_pigs.ceil() as i32
    }
}