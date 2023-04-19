// https://leetcode.com/problems/contains-duplicate-iii/solutions/1542520/easy-rust-solution-o-n-log-k-12ms-faster-than-100/
use std::collections::BTreeSet;
use std::convert::TryFrom;

impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, k: i32, t: i32) -> bool {
        let nums = nums.as_slice();
        let k = usize::try_from(k).unwrap();
        let mut window = BTreeSet::new();
        for (i, &v) in nums.iter().enumerate(){
            if i > k {
                window.remove(&nums[i - k - 1]);
            }
            let range = v.saturating_sub(t)..=v.saturating_add(t);
			// if has at least 1 elem in range
            if window.range(range).next().is_some(){
                return true;
            }
            window.insert(v);
        }
        false
    }
}