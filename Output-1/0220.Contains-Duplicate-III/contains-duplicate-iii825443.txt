// https://leetcode.com/problems/contains-duplicate-iii/solutions/825443/poor-man-s-rust/
impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, k: i32, t: i32) -> bool {
        //  i32 max =  2_147_483_647 i32 (the 8th Mersenne prime)
        let k64:i64 = k.into();
        let t64:i64 = t.into();
        for i in (0..nums.len()) {
            for j in (i..nums.len()) { 
                if i == j { continue; }
                let abs1 = (nums[i as usize] as i64 - nums[j as usize] as i64).abs();
                let abs2 = ((i - j) as i64).abs();
                if abs1 <= t64 && abs2 <= k64 { 
                    return true;
                }
            }
        }
        return false;
    }
}