// https://leetcode.com/problems/contains-duplicate-iii/solutions/1629150/rust-simple-solution-using-a-btreeset-o-n-log-k/
use std::collections::BTreeSet;

impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, k: i32, t: i32) -> bool {
        let n = nums.len();
        let k = k as usize;
        let t = t as i64;
        
        // Acts as a window for items within a `k` wide range.
        let mut window = BTreeSet::new();
        
        for i in 0..n {
			// Get the incoming number and calculate the range of other numbers that
			// would produce a value <= t.
            let num_in = nums[i] as i64;
            let upper  = num_in + t;
            let lower  = num_in - t;
            
            // Check if the window holds any values within range.
            if window.range(lower..=upper).next() != None {
                return true;
            }
            // Add incoming number to window.
            window.insert(num_in);
            
            // If window is full, remove the number going out of scope.
            if i >= k {
                let num_out = nums[i - k] as i64;
                window.remove(&num_out);
            }
        }
        false
    }
}