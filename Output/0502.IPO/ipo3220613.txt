// https://leetcode.com/problems/ipo/solutions/3220613/rust-clear-solution-iterators-binaryheap/
use std::collections::BinaryHeap;

struct Project {
    capital: i32,
    profit: i32,
}

impl Solution {
    pub fn find_maximized_capital(k: i32, w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        let mut projects: Vec<Project> = capital
            .into_iter()
            .zip(profits.into_iter())
            .map(|(capital, profit)| Project { capital, profit })
            .collect();
        projects.sort_unstable_by_key(|elem| elem.capital);

        let mut total_profit = w;
        let mut next_index = 0;
        let mut opportunities = BinaryHeap::with_capacity(projects.len());

        for _ in 0..k {
            while let Some(proj) = projects.get(next_index).filter(|proj| proj.capital <= total_profit) {
                opportunities.push(proj.profit);
                next_index += 1;
            }
            if let Some(max_profit) = opportunities.pop() {
                total_profit += max_profit;
            }
        }

        total_profit
    }
}
