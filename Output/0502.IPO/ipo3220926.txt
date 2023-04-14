// https://leetcode.com/problems/ipo/solutions/3220926/rust-simple-binaryheap-with-sort/
use std::cmp::Ordering;
use std::collections::BinaryHeap;

#[derive(PartialEq, Eq, PartialOrd)]
struct IPOJob {
    profit: i32,
    capital: i32,
}

impl Ord for IPOJob {
    fn cmp(&self, other: &Self) -> Ordering {
        self.capital.cmp(&other.capital)
    }
}
impl Solution {
    pub fn find_maximized_capital(k: i32, w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        let mut jobs: Vec<IPOJob> = profits
            .iter()
            .zip(capital.iter())
            .map(|(&p, &c)| IPOJob {
                profit: p,
                capital: c,
            })
            .collect();
        jobs.sort_unstable_by_key(|x| x.capital);
        let mut curr = 0;
        let mut q = BinaryHeap::new();
        let mut w = w;
        for _ in 0..k {
            while let Some(job) = jobs.get(curr).filter(|x| x.capital <= w) {
                q.push(job);
                curr += 1;
            }
            match q.pop() {
                Some(job) => w += job.profit,
                None => break,
            }
        }
        w
    }
}