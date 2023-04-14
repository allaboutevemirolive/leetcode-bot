// https://leetcode.com/problems/ipo/solutions/3221527/rust-vector-and-binaryheap-with-explanation/
use std::collections::BinaryHeap;

struct Project {
    profit: i32,
    capital: i32,
}


impl Solution {
    pub fn find_maximized_capital(k: i32, w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        let mut profits_queue = BinaryHeap::new();

        let mut projects: Vec<Project> = profits.into_iter()
            .zip(capital.into_iter())
            .map(|(profit, capital)| Project { profit, capital })
            .collect();

        projects.sort_unstable_by_key(|project| project.capital);

        let mut next_index = 0;
        let mut max_profit = w;
        for _ in 0..k {
            while let Some(proj) = projects.get(next_index).filter(|p| p.capital <= max_profit) {
                profits_queue.push(proj.profit);
                next_index += 1;
            }

            if profits_queue.is_empty() {
                break;
            }

            if let Some(profit) = profits_queue.pop() {
                max_profit += profit;
            }
        }

        max_profit
    }
}