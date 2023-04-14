// https://leetcode.com/problems/maximum-gap/solutions/2065940/rust-clean-solution/
impl Solution {
    pub fn maximum_gap(nums: Vec<i32>) -> i32 {
        let n = nums.len();

        // Find the min max of the nums array
        let min = *nums.iter().min().unwrap();
        let max = *nums.iter().max().unwrap();

        // Edge case: If the min and maz is equal, return zero
        // as there can not be any difference
        if min == max {
            return 0;
        }

        // Compute the gap
        let mut gap = (max - min) / (n as i32 - 1);


        // If gap is not perfectly divisible
        if (max - min) % (n as i32 - 1) != 0 {
            gap += 1;
        }

        // Prepare the min max array for each element in the array
        let mut min_bucket = vec![i32::MAX; n];
        let mut max_bucket = vec![i32::MIN; n];
        for num in nums {
            let bkt = ((num - min) / gap) as usize;
            min_bucket[bkt] = std::cmp::min(min_bucket[bkt], num);
            max_bucket[bkt] = std::cmp::max(max_bucket[bkt], num);
        }

        // Now we iterate over the buckets and compare the difference between
        // the max of previous bucket and min of current bucket
        let mut result = i32::MIN;
        let mut prev_max = i32::MIN;

        for i in 0..n {
            // If the element does not belong to any bucket
            // It's value would be set to MAX in max_bucket as initialization
            if min_bucket[i] == i32::MAX {
                continue;
            }

            // If this is the first traversal, prev_max would be MAX
            if prev_max == i32::MIN {
                prev_max = max_bucket[i];
                continue;
            }

            // Update the result
            result = std::cmp::max(result, min_bucket[i] - prev_max);

            // Update the previous amx
            prev_max = max_bucket[i];
        }

        return result;
    }
}