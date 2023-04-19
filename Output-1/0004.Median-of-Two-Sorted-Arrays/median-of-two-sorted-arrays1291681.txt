// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/1291681/rust-long/
use std::cmp::{min};
impl Solution {

    pub fn find_median_sorted_arrays(nums1: Vec<i32>, nums2: Vec<i32>) -> f64 {
        //println!("{:?} {:?}", nums1, nums2);
        let sorted_total_size: usize = nums1.len() + nums2.len();
        let mut i: usize = 0;
        let mut j: usize = 0;
        let mut last_inc_i = false;

        if nums1.len() == 0 {
            if sorted_total_size % 2 == 0 {
                return (nums2[nums2.len()/2 - 1] as f64 + nums2[nums2.len()/2] as f64) / 2.0;
            } else {
                return nums2[nums2.len()/2] as f64;
            }
        } else if nums2.len() == 0 {
            if sorted_total_size % 2 == 0 {
                return (nums1[nums1.len()/2 - 1] as f64 + nums1[nums1.len()/2] as f64) / 2.0;
            } else {
                return nums1[nums1.len()/2] as f64;
            }
        }
        while i + j < sorted_total_size / 2 {
            if i >= nums1.len() {
                j += 1;
                last_inc_i = false;
            } else if j >= nums2.len()  {
                i += 1;
                last_inc_i = true;
            } else if nums1[i] > nums2[j] {
                j += 1;
                last_inc_i = false;
            } else {
                i += 1;
                last_inc_i = true;
            }
        }
        if sorted_total_size % 2 == 0 {
            if i < nums1.len() && j < nums2.len() {
                let mut temp: Vec<i32> = Vec::new();
                temp.push(nums1[i]);
                temp.push(nums2[j]);
                if i > 0 && last_inc_i {
                    temp.push(nums1[i - 1]);
                }
                if j > 0 && !last_inc_i {
                    temp.push(nums2[j - 1]);
                }

                let temp_min: i32 = *temp.iter().min().unwrap();
                let index = temp.iter().position(|x| *x == temp_min).unwrap();
                temp.remove(index);
                return (temp_min + temp.iter().min().unwrap()) as f64 / 2.0 ;
            } else if i >= nums1.len() {
                if j == 0 {
                    if nums1.len() == 0 {
                        return (nums2[j] as f64 + nums2[j + 1] as f64) / 2.0;
                    } else {
                        return (nums1[i - 1] as f64 + nums2[j] as f64) / 2.0;
                    }

                } else {
                    let mut temp: Vec<i32> = Vec::new();
                    temp.push(nums2[j]);
                    if i > 0 && last_inc_i {
                        temp.push(nums1[i - 1]);
                    }
                    if j > 0 && !last_inc_i {
                        temp.push(nums2[j - 1]);
                    }
                    let temp_min: i32 = *temp.iter().min().unwrap();
                    let index = temp.iter().position(|x| *x == temp_min).unwrap();
                    temp.remove(index);
                    return (temp_min + temp.iter().min().unwrap()) as f64 / 2.0;
                }
            } else {
                if j == 0 {
                    if nums1.len() == 0 {
                        return (nums2[j] as f64 + nums2[j + 1] as f64) / 2.0;
                    } else {
                        return (nums1[i - 1] as f64 + nums2[j] as f64) / 2.0;
                    }
                } else {
                    let mut temp: Vec<i32> = Vec::new();
                    temp.push(nums1[i]);
                    if j > 0 && !last_inc_i {
                        temp.push(nums2[j - 1]);
                    }
                    if i > 0 && last_inc_i {
                        temp.push(nums1[i - 1]);
                    }
                    let temp_min: i32 = *temp.iter().min().unwrap();
                    let index = temp.iter().position(|x| *x == temp_min).unwrap();
                    temp.remove(index);
                    return (temp_min + temp.iter().min().unwrap()) as f64 / 2.0;
                }
            }
        } else {
            if i < nums1.len() && j < nums2.len() {
                return min(nums1[i], nums2[j]) as f64;
            } else if i >= nums1.len() {
                return nums2[j] as f64;
            } else {
                if true {
                    return nums1[i] as f64;
                } else {
                    return nums2[j - 1] as f64;
                }
            }
        }
    }
}