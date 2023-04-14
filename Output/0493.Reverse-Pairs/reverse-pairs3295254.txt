// https://leetcode.com/problems/reverse-pairs/solutions/3295254/rust-50ms-solution/
impl Solution {
    pub fn reverse_pairs(nums: Vec<i32>) -> i32 {
        let mut res = 0;
        let mut nums = nums.clone();
        Solution::merge_sort(&mut nums, &mut res);
        res
    }
    fn merge_sort(nums: &mut [i32], res: &mut i32) {
        let n = nums.len();
        if n < 2 {
            return;
        }
        let mid = n >> 1;
        Solution::merge_sort(&mut nums[..mid], res);
        Solution::merge_sort(&mut nums[mid..], res);
        Solution::cal(nums, mid, n, res);
        Solution::merge2(nums, mid, n);
    }
    fn cal(nums: &[i32], mid: usize, n: usize, count: &mut i32) {
        let mut i = mid;
        for x in &nums[..mid] {
            while i < n && *x as i64 > 2 * nums[i] as i64 {
                i += 1;
            }
            *count += (i - mid) as i32;
        }
    }
    fn merge2(nums: &mut [i32], mid: usize, n: usize) {
        let mut i = 0;
        let mut j = mid;
        let mut k = 0;
        let mut res = vec![0; n];
        
        while i < mid && j < n {
            if nums[i] < nums[j] {
                res[k] = nums[i];
                i += 1;
            } else {
                res[k] = nums[j];
                j += 1;
            }
            k += 1;
        }
        while i < mid {
            res[k] = nums[i];
            i += 1;
            k += 1;
        }
        while j < n {
            res[k] = nums[j];
            j += 1;
            k += 1;
        }
        nums.clone_from_slice(&res)
    }
}