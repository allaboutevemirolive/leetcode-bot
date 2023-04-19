// https://leetcode.com/problems/contains-duplicate-iii/solutions/1196591/brute-force-rust-soln/
impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, k: i32, t: i32) -> bool {
        let n = nums.len();
        let k = k as usize;
        let t = t as i64;
        nums.iter().enumerate().any(|(i, &x)| {
            let x = x as i64;
            nums[i.saturating_sub(k)..i]
                .iter()
                .any(|&y| (y as i64 - x).abs() <= t)
        })
    }
}