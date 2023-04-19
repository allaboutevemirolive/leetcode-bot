// https://leetcode.com/problems/contains-duplicate-iii/solutions/1012421/rust-sorted-list-90-cpu-71-mem-o-n-log-k/
impl Solution {
    pub fn contains_nearby_almost_duplicate(nums: Vec<i32>, k: i32, t: i32) -> bool {        
        if nums.len() == 0 || k < 0 {
            return false;
        }
    
	    // Will be used as list index (bounds guaranteed by description)
        let k = k as usize;
        
        let mut vals = Vec::new();
        
        for (i, &x) in nums.iter().enumerate() {
            if i > k {                                                                         
			    // this is our pruning step. We can remove by value because we know if we had duplicates in the set then we would have
				// already had a match, so there will be just one element with `value = nums[i-k-1]`.
                let pt = nums[i-k-1];
                let rmv_idx = vals.binary_search(&pt).unwrap(); // safe since we inserted it k+1 iterations ago
                vals.remove(rmv_idx);
            }
            
            let insertion_pt = match vals.binary_search(&x) {
                Ok(_) => {
				    // Ok means we found an exact match for `x`, which satisfies any `t`
				    return true;
			    }
                Err(ins_pt) => ins_pt
            };
            vals.insert(insertion_pt, x);
            			
			
			// saturating add. Any value below this is within `t` of `x`
			let up_lim = x.checked_add(t).unwrap_or(i32::max_value());
			
			// equivalent of `TreeSet.ceil()` in Java solutions
            if insertion_pt+1 < vals.len() && vals[insertion_pt+1] <= up_lim {
                return true;
            }
            
			// same thing below (equiv. of `TreeSet.floor()`)
            let down_lim = x.checked_sub(t).unwrap_or(i32::min_value());
            if insertion_pt > 0 && vals[insertion_pt-1] >= down_lim {
                return true;
            }
        }
        
        return false;
    }
}