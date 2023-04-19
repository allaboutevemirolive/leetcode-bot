// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/2137433/rust/
impl Solution {
    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        let m = nums1.len();
        let n = nums2.len();
		
		// Make sure if those two arrays are oven, or sum two length is oven
        let mut even = false;
        if (m + n) % 2 == 0 {
            even = true;
        }

        let mut i = 0;
        let mut j = 0;
        let mut k = 0;
    
        let mut median = ( m + n) / 2;

        let mut median1 = 0;
        let mut median2 = 0;

        while i < m && j < n {
            if nums1[i] <= nums2[j]{
                if k == median - 1 && even {
                    median1 = nums1[i];
                } else if k == median && even {
                    median2 = nums1[i];
                    return (median1 as f64 + median2 as f64) / 2.0;
                } else if k == median {
                    median2 = nums1[i];
                    return median2 as f64;
                }
                i += 1; 
            } else {
                if k == median - 1 && even {
                    median1 = nums2[j];
                } else if k == median && even {
                    median2 = nums2[j];
                    return (median1 as f64 + median2 as f64) / 2.0;
                } else if k == median {
                    median2 = nums2[j];
                    return median2 as f64;
                }

                j += 1;
            }

            k += 1;
        }

        while i < m {
            if k as i32 == (median as i32 - 1) && even {
                median1 = nums1[i];
            } else if k == median && even {
                median2 = nums1[i];
                return (median1 as f64 + median2 as f64) / 2.0;
            } else if k == median {
                median2 = nums1[i];
                return median2 as f64;
            }
            i += 1;
            k += 1;
        }

        while j < n {
            if k as i32 == (median as i32 - 1) && even {
                median1 = nums2[j];
            } else if k == median && even {
                median2 = nums2[j];
                return (median1 as f64 + median2 as f64) / 2.0;
            } else if k == median {
                median2 = nums2[j];
                return median2 as f64;
            }

            j += 1;
            k += 1;
        }

        if even {
            return (median1 as f64 + median2 as f64) / 2.0000;
        } else {
            return median2 as f64;
        }

    }
}