// https://leetcode.com/problems/split-array-with-same-average/solutions/2598855/python-rust-hashmap-for-memoization/
use std::collections::HashMap;

impl Solution {
    pub fn split_array_same_average(nums: Vec<i32>) -> bool {
        let mut snums = nums.to_owned();
        if nums.len() == 1 {
            return false
        }
        
        let sm: i32 = nums.iter().sum();
        
        let mean: i32 = ((nums.iter().sum::<i32>() as f64) / nums.len() as f64) as i32;
        
        if sm % (nums.len() as i32) == 0 && nums.contains(&mean) {
            return true
        }
        
        if nums.len() == 2 {
            return false
        }
        snums.sort();
        
        let mut mem = HashMap::new();
        fn sums(i:i32, j:i32, target:i32,nums:&Vec<i32>, mem: &mut HashMap<(i32,i32,i32),bool>) -> bool {
            if let Some(verasity) = mem.get(&(i,j,target)) {
                return *verasity
            }
            let mut _i = i as usize;
            let mut _j = j as usize;
            while _i < _j {
                if nums[_i] + nums[_j] == target {
                    mem.insert((i,j,target),true);
                    return true
                } else if nums[_i] + nums[_j] > target {
                    _j -= 1;
                } else {
                    _i += 1;
                }
            }
            mem.insert((i,j,target),false);
            false
        }
        let mut mem2 = HashMap::new();
        fn nsums(ct:i32,i:i32,j:i32,target:i32, nums:&Vec<i32>, 
            mem: &mut HashMap<(i32,i32,i32),bool>, 
            mem2: &mut HashMap<(i32,i32,i32,i32),bool>) -> bool {
            if let Some(verasity) = mem2.get(&(ct,i,j,target)) {
            return *verasity
            }
            if ct == 2 {
                return sums(i,j,target,&nums, mem)
            } else {
                for k in (i as usize)..(nums.len()-2) {
                    if nsums(ct -1, (k+1) as i32, j, target-nums[k], nums, mem, mem2) {
                        mem2.insert((ct,i,j,target),true);
                        return true
                        }
                    }
                }
                mem2.insert((ct,i,j,target), false);
                false
        }
        
        for ct in (2..=((nums.len()/2 + 1) as i32)) {
            if (sm * ct) % (nums.len() as i32) == 0 && 
            nsums(ct,0,(nums.len() - 1) as i32, (sm * ct) / (nums.len() as i32), &snums, &mut mem, &mut mem2) {
                return true
            }
        }
        false
    }
}