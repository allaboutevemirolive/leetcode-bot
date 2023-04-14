// https://leetcode.com/problems/arithmetic-slices-ii-subsequence/solutions/2851925/rust-heavy-hashing/
use std::collections::{HashMap, HashSet};

impl Solution {
    pub fn number_of_arithmetic_slices(nums: Vec<i32>) -> i32 {
        let mut wanted: HashMap<i32, HashSet<i32>> = HashMap::new();
        let mut dp: HashMap<(i32, i32), i32> = HashMap::new();
        let mut count: HashMap<i32, i32> = HashMap::new();
        let mut ans = 0;
        for &y in nums.iter() {
            if let Some(set) = wanted.get(&y) {
                for &x in set.iter() {
                    if let Some(w) = x.checked_sub(y - x) {
                        let total = *dp.get(&(w, x)).unwrap_or(&0);
                        ans += total;
                        *dp.entry((x, y)).or_insert(0) += total;
                    }
                }
            }
            for (&x, &c) in count.iter().filter(|(&x, _)| x != y) {
                *dp.entry((x, y)).or_insert(0) += c;
                if let Some(z) = y.checked_add(y - x) {
                    wanted.entry(z).or_insert(HashSet::new()).insert(y);
                }
            }
            *count.entry(y).or_insert(0) += 1;
        }
        for &c in count.values().filter(|&&c| c > 2) {
            ans += (1 << c) - 1 - c - c * (c - 1) / 2;
        }
        ans
    }
}