// https://leetcode.com/problems/ipo/solutions/3220971/rust-greedy-using-heap/
use std::cmp::Ordering;
use std::collections::BinaryHeap;

impl Solution {

    pub fn find_maximized_capital(mut k: i32, mut w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        
        // [capital_required[i], profits[i]]
        let mut cp_pairs: Vec<(&i32, &i32)> = capital.iter().zip(profits.iter()).collect();     
        // sort by increasing capital 
        cp_pairs.sort_by(|a, b| { a.0.cmp(&b.0) });

        let mut max_heap = BinaryHeap::new();
        let mut curr = 0;
        for i in 0..k {
            // check if we can undertake current project 
            while curr < cp_pairs.len() && *cp_pairs[curr].0 <= w {
                // push the profit 
                max_heap.push(*cp_pairs[curr].1);
                curr += 1;
            }
            if max_heap.is_empty() {
                break;
            }
            w += max_heap.pop().unwrap();
        }

        w
    }
}