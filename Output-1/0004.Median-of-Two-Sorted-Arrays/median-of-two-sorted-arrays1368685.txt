// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/1368685/rust-3-ms/
pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
    if nums1.len() == 1 && nums2.len() == 1 {
		let num1 = nums1[0];
		let num2 = nums2[0];

		if num1 == 0 && num2 == 0 {
			return 0.0;
		} else if num1 == 0 {
			return num2 as f64;
		} else if num2 == 0 {
			return num1 as f64;
		}

		return (num1 + num2) as f64 / 2.0;
	}

	let mut merged = [nums1, nums2].concat();
	merged.sort_unstable();

	let len = merged.len();

	if len % 2 == 0 {
		return ((merged[(len / 2) - 1] + merged[len / 2]) as f64) / 2.0;
	} else {
		return merged[(len - 1) / 2] as f64;
	}
}