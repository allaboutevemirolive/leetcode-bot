// https://leetcode.com/problems/preimage-size-of-factorial-zeroes-function/solutions/740549/rust-translated/
impl Solution {
    pub fn preimage_size_fzf(mut k: i32) -> i32 {
        let mut nums = vec![0; 13];
        nums[0] = 1;
        for i in 1..13 {
            nums[i] = 5 * nums[i - 1] + 1;
        }
        for i in (0..13).rev() {
            let num = nums[i];
            if k / num == 5 {
                return 0;
            }
            k %= nums[i];
        }
        return 5;
    }
}

#[cfg(test)]
mod tests {

    use super::*;
    #[test]
    fn test_preimage_size_fzf() {
        assert_eq!(Solution::preimage_size_fzf(0), 5)
    }

    #[test]
    fn test_preimage_size_fzf_02() {
        assert_eq!(Solution::preimage_size_fzf(5), 0)
    }
}