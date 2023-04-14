// https://leetcode.com/problems/contains-duplicate-iii/solutions/1630726/rust-bucket-approach-concise-explanation-very-fast-o-n/
use std::collections::HashMap;
use std::collections::HashSet;

impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, k: i32, t: i32) 
        -> bool 
    {
        let n = nums.len();
        let k = k as usize;
        let t = t as i64;

        if k > 0 {
            if t != 0 {
                // The map containing the "buckets".
                let mut window = HashMap::new();
                
                for i in 0..n {
                    // Get adjusted next number and create its collidable key.
                    let num = nums[i] as i64 - i32::MIN as i64;
                    let key = num / (t + 1);

                    // Insert `num` in window and return `true` if collision.
                    // If no collision, check the two adjacent "buckets".
                    if window.insert(key, num) != None ||
                       window.get(&(key - 1)).map_or(false, |v| num - v <= t) || 
                       window.get(&(key + 1)).map_or(false, |v| v - num <= t) 
                    {
                        return true;
                    }	
                    // Remove the number going out of the window's scope.
                    if i >= k {
                        let num = nums[i - k] as i64 - i32::MIN as i64;
                        let key = num / (t + 1);
                        
                        window.remove(&key);
                    }
                }
            } 
            else {
                // If `t == 0`, then we're simply looking for duplicate numbers 
                // and can use a simpler/faster algorithm.
                
                let mut window = HashSet::new();
                
                for i in 0..n {
                    if !window.insert(nums[i]) {
                        return true;
                    }
                    if i >= k {
                        window.remove(&nums[i - k]);
                    }
                }
            }
        }
        false
    }
}