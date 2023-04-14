// https://leetcode.com/problems/ipo/solutions/3220357/rust-47ms-o-n-log-n-sorting-and-pq-full-solution-with-comments-and-explanation/
use std::collections::BinaryHeap;

impl Solution {
    pub fn find_maximized_capital(k: i32, mut w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        // get length of array
        let n = profits.len();
        // create vector of pairs so that we can sort
        let mut v = vec![];
        // add all pairs, then sort
        for i in 0..n {
            v.push((capital[i], profits[i]));
        }
        v.sort();
        // create priority queue
        let mut pq = BinaryHeap::<i32>::new();
        let mut p = 0;
        for i in 0..k {
            // add all projects we can do with our current capital
            while p < n && v[p].0 <= w {
                pq.push(v[p].1);
                p += 1;
            }
            // find best project, or if none exists, give up
            let mut top = *(pq.peek().unwrap_or(&-15210));
            // if our best project gains capital, do it
            if top >= 0 {
                w += top;
                pq.pop();
            }
            // if we can't gain capital in any way, we're done
            else {
                break;
            }
        }
        return w;
    }
}