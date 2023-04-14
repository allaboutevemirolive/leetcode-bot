// https://leetcode.com/problems/split-array-largest-sum/solutions/1308438/rust-binary-search-solution/
impl Solution {
    pub fn split_array(nums: Vec<i32>, m: i32) -> i32 {
        let n = nums.len();
        let mut r = nums.iter().sum::<i32>();
        let mut l = *nums.iter().max().unwrap();
        while l < r {
            // calc how many buckets needed to not exceeding mid
            let mid = l + (r - l) / 2;
            let mut acc = 0;
            let mut bucket_ct = 1;
            for i in 0..n {
                if acc + nums[i] <= mid {
                    acc += nums[i];
                } else {
                    acc = nums[i];
                    bucket_ct += 1;
                }
            }
            if bucket_ct > m {
                l = mid + 1;
            } else {
                r = mid;
            }
        }
        l
    }
}