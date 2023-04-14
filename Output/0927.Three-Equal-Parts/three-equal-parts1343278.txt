// https://leetcode.com/problems/three-equal-parts/solutions/1343278/rust-4ms-o-n-time-o-1-space/
impl Solution {
    pub fn three_equal_parts(arr: Vec<i32>) -> Vec<i32> {
        // 1. all three parts must have the same number of ones
        // 2. all three parts must be equal, except for leading zeroes

        let ones: i32 = arr.iter().sum();
        if ones % 3 != 0 {
            return vec![-1, -1];
        } else if ones == 0 {
            return vec![0, arr.len() as i32 - 1];
        }

        let ones_in_part = ones / 3;

        let trailing_zeros = arr.len() - 1 - arr.iter().rposition(|&x| x == 1).unwrap();
        let (last_part_start, _) = arr[..arr.len() - trailing_zeros]
            .iter()
            .enumerate()
            .rev()
            .filter(|(_, &x)| x == 1)
            .nth(ones_in_part as usize - 1)
            .unwrap();
        let mid_part_end_inclusive = arr[..last_part_start]
            .iter()
            .rposition(|&x| x == 1)
            .unwrap()
            + trailing_zeros;
        if mid_part_end_inclusive >= last_part_start {
            return vec![-1, -1];
        }
        let (mid_part_start, _) = arr[..=mid_part_end_inclusive]
            .iter()
            .enumerate()
            .rev()
            .filter(|(_, &x)| x == 1)
            .nth(ones_in_part as usize - 1)
            .unwrap();
        let first_part_end_inclusive =
            arr[..mid_part_start].iter().rposition(|&x| x == 1).unwrap() + trailing_zeros;
        let first_part_start = arr.iter().position(|&x| x == 1).unwrap();

        if first_part_end_inclusive >= mid_part_start
            || arr[first_part_start..=first_part_end_inclusive]
                != arr[mid_part_start..=mid_part_end_inclusive]
            || arr[mid_part_start..=mid_part_end_inclusive] != arr[last_part_start..]
        {
            vec![-1, -1]
        } else {
            vec![
                first_part_end_inclusive as i32,
                mid_part_end_inclusive as i32 + 1,
            ]
        }
    }
}