// https://leetcode.com/problems/contains-duplicate-iii/solutions/3304874/rust-hard-contains-duplicate-iii/
impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, index_diff: i32, value_diff: i32) -> bool {
        let mut set = std::collections::HashSet::<i64>::new();
        for i in 0..nums.len() {
            if i > index_diff as usize {
                set.remove(&(nums[i-index_diff as usize - 1] as i64));
            }
            for &j in set.iter() {
                if (nums[i] as i64 - j).abs() <= value_diff as i64 {
                    return true;
                }
            }
            set.insert(nums[i] as i64);
        }
        false
    }
}