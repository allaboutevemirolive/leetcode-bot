// https://leetcode.com/problems/sliding-window-median/solutions/1847348/rust-two-btreemaps-solution-24-ms-o-n-logk/
use std::collections::BTreeMap;
use std::iter::FromIterator;

#[derive(Default, Debug)]
struct MedianFinder {
    lsize: usize,
    l: BTreeMap<i32, usize>,
    hsize: usize,
    h: BTreeMap<i32, usize>,
}

impl MedianFinder {
    fn dec_remove(btm: &mut BTreeMap<i32, usize>, num: i32) {
        btm.entry(num).and_modify(|e| *e -= 1);
        if btm.get(&num) == Some(&0) {
            btm.remove(&num);
        }
    }
    
    fn new() -> Self {
        Default::default()
    }
    
    fn add_num(&mut self, num: i32) {
        if self.lsize == self.hsize {
            *self.h.entry(num).or_insert(0) += 1;
            let hl = self.h.keys().next().cloned().unwrap();
            Self::dec_remove(&mut self.h, hl);
            *self.l.entry(hl).or_insert(0) += 1;
            self.lsize += 1;
        } else {
            *self.l.entry(num).or_insert(0) += 1;
            let lh = self.l.keys().last().cloned().unwrap();
            Self::dec_remove(&mut self.l, lh);
            *self.h.entry(lh).or_insert(0) += 1;
            self.hsize += 1;
        }
    }
    
    fn del_num(&mut self, mut num: i32) {
        if self.lsize == self.hsize {
            if self.h.contains_key(&num) {
                Self::dec_remove(&mut self.h, num);
            } else if self.l.contains_key(&num) {
                Self::dec_remove(&mut self.l, num);
                let hl = self.h.keys().next().cloned().unwrap();
                Self::dec_remove(&mut self.h, hl);
                *self.l.entry(hl).or_insert(0) += 1;
            }
            self.hsize -= 1;
        } else {
            if self.l.contains_key(&num) {
                Self::dec_remove(&mut self.l, num);
            } else if self.h.contains_key(&num) {
                Self::dec_remove(&mut self.h, num);
                let lh = self.l.keys().last().cloned().unwrap();
                Self::dec_remove(&mut self.l, lh);
                *self.h.entry(lh).or_insert(0) += 1;
            }
            self.lsize -= 1;
        }
    }
    
    fn find_median(&self) -> f64 {
        if self.lsize == self.hsize {
            self.l.keys().last().zip(self.h.keys().next()).map(|(&lh, &hl)| lh as f64 + hl as f64).map(|m| m / 2f64).unwrap()
        } else {
            self.l.keys().last().cloned().unwrap() as f64
        }
    }
}

impl Solution {
    pub fn median_sliding_window(nums: Vec<i32>, k: i32) -> Vec<f64> {
        let n = nums.len();
        let k = k as usize;
        let mut fm = MedianFinder::new();
        nums[0..k].iter().for_each(|&num| fm.add_num(num));
        // println!("i: 0, fm: {fm:?}");
        std::iter::once(fm.find_median()).chain(
            (1..=n-k).map(|i| {
                fm.del_num(nums[i-1]);
                fm.add_num(nums[k+i-1]);
                // println!("i: {i}, fm: {fm:?}");
                fm.find_median()
            })
        ).collect()
    }
}