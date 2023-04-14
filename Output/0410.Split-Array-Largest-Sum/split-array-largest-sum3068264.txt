// https://leetcode.com/problems/split-array-largest-sum/solutions/3068264/simple-and-readable-solution-using-binary-search-typescript-js/
impl Solution {
    pub fn split_array(nums: Vec<i32>, k: i32) -> i32 {
        let mut start_sum: i32 = *nums.iter().max().unwrap();
        let mut end_sum: i32 = nums.iter().sum::<i32>();

        while start_sum < end_sum{
            let mid: i32 = (start_sum+end_sum)/2;
            if Self::is_feasible(mid, &nums, k){
                end_sum = mid;
                continue;
            }
            start_sum = mid + 1;
        }

        return start_sum;
    }
    pub fn is_feasible(group_sum: i32, nums: &Vec<i32>, groups: i32) -> bool{
        let mut temp_sum: i32 = 0;
        let mut count_groups: i32 = 1;
        for num in nums{
            temp_sum += num;
            if temp_sum > group_sum{
                temp_sum = *num;
                count_groups += 1;
                if count_groups > groups{
                    return false;
                }
            }
        }
        return true;
    }
}