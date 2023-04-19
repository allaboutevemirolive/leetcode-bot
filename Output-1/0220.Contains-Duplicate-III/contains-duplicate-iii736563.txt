// https://leetcode.com/problems/contains-duplicate-iii/solutions/736563/rust-cheapest-best/
use std::collections::BTreeSet;

impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, k: i32, t: i32) -> bool {
        if k <= 0 || t < 0 {
            return false;
        }
        let t = t as i64;
        nums.iter()
            .map(|n| *n as i64)
            .enumerate()
            .try_fold(BTreeSet::new(), |mut s, (i, n)| {
                match s.range((n - t)..=(n + t)).next() {
                    Some(_) => None,
                    _ => {
                        if i >= k as usize {
                            s.remove(&(nums[i - k as usize] as i64));
                        }
                        s.insert(n);
                        Some(s)
                    }
                }
            })
            .is_none()
    }
}