// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/2980716/first-code-in-rust/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let mut nums = vec![];
        for num2 in &nums2{
            nums.push(*num2);
        }
        for num1 in &nums1{
            nums.push(*num1);
        }
        nums.sort();
        if nums.len() % 2 == 1{
            return f64::from(nums[nums.len() / 2]);
        }
        else{
            let sum = f64::from(nums[nums.len() / 2 - 1] + nums[nums.len() / 2]);
            return 0.5 * sum;
        }
    }
}