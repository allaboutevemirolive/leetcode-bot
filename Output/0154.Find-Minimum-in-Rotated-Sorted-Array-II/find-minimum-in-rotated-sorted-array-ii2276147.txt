// https://leetcode.com/problems/find-minimum-in-rotated-sorted-array-ii/solutions/2276147/rust-simple-binary-search-easy-understanding/
impl Solution {
	pub fn find_min(nums: Vec<i32>) -> i32 {
		let (mut s, mut e) = (0,nums.len()-1);
		while s<e {
			let m = (s+e)>>1;
			if nums[m] < nums[e] {e = m;}
			else if nums[m] > nums[e]{s = m+1;}
			else {e-=1;}
		}
		nums[s]
	}
}