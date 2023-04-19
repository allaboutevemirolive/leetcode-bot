// https://leetcode.com/problems/median-of-two-sorted-arrays/solutions/502019/rust-4ms/
use std::cmp::Ordering;
use std::i32::MAX;

impl Solution {
    pub fn find_median_sorted_arrays(data1: Vec<i32>, data2: Vec<i32>) -> f64 {
        let mid = (data1.len() + data2.len()) as f32 / 2.0;
        let mut d1_iter = data1.iter();
        let mut d2_iter = data2.iter();
        let mut d1 = d1_iter.next().unwrap_or(&MAX);
        let mut d2 = d2_iter.next().unwrap_or(&MAX);
        
        let mut count = 0;
        let mut result = Vec::<i32>::new();
        loop {
            if (d1 == &MAX && d2 == &MAX) || count > mid as i32 {
                break;
            }
            match d1.cmp(&d2) {
                Ordering::Less => {
                    result.push(*d1);
                    d1 = d1_iter.next().unwrap_or(&MAX);
                }
                Ordering::Greater | Ordering::Equal => {
                    result.push(*d2);
                    d2 = d2_iter.next().unwrap_or(&MAX);
                }
            }
            count += 1;
        }
        let left = mid as usize;
        let right = mid.ceil() as usize;
        match left.cmp(&right) {
            Ordering::Equal => (result[left - 1] + result[right]) as f64 / 2.0,
            _ => result[left] as f64,
        }
    }
}