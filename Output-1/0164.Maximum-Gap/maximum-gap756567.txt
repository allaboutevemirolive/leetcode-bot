// https://leetcode.com/problems/maximum-gap/solutions/756567/rust-translated/
impl Solution {
    pub fn maximum_gap(mut nums: Vec<i32>) -> i32 {
        let n = nums.len();
        if n < 2 {
            return 0;
        }

        let mut bucket = vec![0; n];
        let mut e = 1;
        for i in 0..8 {
            let mut counts = [0; 16];
            for j in 0..n {
                counts[(&nums[j] / e % 16) as usize] += 1;
            }
            for j in 1..16 {
                counts[j] += counts[j - 1];
            }
            for j in (0..n).rev() {
                counts[(&nums[j] / e % 16) as usize] -= 1;
                bucket[counts[(&nums[j] / e % 16) as usize] as usize] = nums[j];
            }
            e <<= 4;
            std::mem::swap(&mut nums, &mut bucket);
        }
        let mut ans = 0;
        for i in 1..n {
            ans = ans.max(nums[i] - nums[i - 1])
        }
        ans
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_maximum_gap() {
        assert_eq!(Solution::maximum_gap(vec![3, 6, 9, 1]), 3)
    }

    #[test]
    fn test_maximum_gap_02() {
        assert_eq!(Solution::maximum_gap(vec![10]), 0)
    }
}