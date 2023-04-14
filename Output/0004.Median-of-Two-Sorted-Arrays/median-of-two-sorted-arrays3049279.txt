// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/3049279/rust-binary-search-no-merging-non-recursive-0ms-2mb/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let n1 = nums1.len();
        let n2 = nums2.len();

        match (n1, n2) {
            (0, 0) => 0.0,
            (0, _) => Self::median(&nums2),
            (_, 0) => Self::median(&nums1),
            (_, _) => Self::combined_median(&nums1, &nums2),
        }
    }

    /// Returns the median of the given list of numbers. The list must be sorted
    /// and non-empty.
    /// 
    fn median(nums: &[i32]) -> f64 {
        let n = nums.len();
        let m = n / 2;

        match n & 1 {
            0 => (nums[m - 1] + nums[m]) as f64 / 2.0,
            _ => nums[m] as f64,
        }
    }

    /// Returns the median as if `nums1` and `nums2` were combined into a single
    /// list. Both `nums1` and `nums2` must be sorted and non-empty.
    /// 
    fn combined_median(nums1: &[i32], nums2: &[i32]) -> f64 {
        let n1 = nums1.len();
        let n2 = nums2.len();

        let (i, j) = Self::bisect_combined_middle(nums1, nums2);

        if (n1 + n2) & 1 == 0 {
            let m1 = Self::curr(nums1, nums2, i, j);
            let m2 = Self::prev(nums1, nums2, i, j);

            (m1 + m2) as f64 / 2.0
        } else {
            Self::curr(nums1, nums2, i, j) as f64
        }
    }

    /// Returns the current value from the combined list of `nums1` and `nums2` 
    /// at the given indexes.
    /// 
    fn curr(nums1: &[i32], nums2: &[i32], i: usize, j: usize) -> i32 {
        let n1 = nums1.len();
        let n2 = nums2.len();
        if      i >= n1 { nums2[j] } 
        else if j >= n2 { nums1[i] } 
        else            { nums1[i].min(nums2[j]) }
    }

    /// Returns the previous value from the combined list of `nums1` and `nums2`
    /// at the given indexes.
    /// 
    fn prev(nums1: &[i32], nums2: &[i32], i: usize, j: usize) -> i32 {
        let n1 = nums1.len();
        let n2 = nums2.len();
        if      i == 0 { nums2[j - 1] } 
        else if j == 0 { nums1[i - 1] } 
        else           { nums1[i - 1].max(nums2[j - 1]) }
    }

    /// Uses binary search and returns the indexes within `nums1` and `nums2`, 
    /// respectively, that represent the mid point of the combined list.
    /// 
    fn bisect_combined_middle(nums1: &[i32], nums2: &[i32]) -> (usize, usize) {
        let n1 = nums1.len();
        let n2 = nums2.len();
        let m  = (n1 + n2) / 2;

        let (mut l1, mut r1) = (0, n1);
        let (mut l2, mut r2) = (0, n2);
        let mut i;
        let mut j;

        while l1 < r1 {
            i = (l1 + r1) / 2;
            j = Self::bisect_left(nums2, nums1[i], l2, r2);

            if i + j < m {
                l1 = i + 1; 
                l2 = j;
            } else {
                r1 = i;
                r2 = (j + 1).min(n2);
            }
        }
        // Correct the occasional off-by-1 (or 2).
        while l1 + l2 < m {
            if l1 < n1 && nums1[l1] < nums2[l2] {
                l1 += 1;
            } else {
                l2 += 1;
            }
        }
        (l1, l2)
    }

    /// Performs a binary search and returns the leftmost insertion point for 
    /// `x` in `nums`. Limit the range within `nums` to `[l, r)`.
    /// 
    #[inline]
    fn bisect_left(nums: &[i32], x: i32, l: usize, r: usize) -> usize {
        let     n = nums.len();
        let mut l = l;
        let mut r = r;
        let mut i;

        while l < r {
            i = (l + r) / 2;
            if nums[i] < x {
                l = i + 1;
            } else {
                r = i;
            }
        }
        l
    }
}