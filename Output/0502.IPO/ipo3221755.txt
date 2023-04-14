// https://leetcode.com/problems/ipo/solutions/3221755/rust-efficient-solution-with-2-binary-heaps/
#[derive(Eq, Ord)]
struct Project {
    profit: i32,
    capital_needed: i32,
}

impl PartialOrd for Project {
    fn partial_cmp(&self, other: &Self) -> Option<std::cmp::Ordering> {
        Some(self.capital_needed.cmp(&other.capital_needed))
    }
}

impl PartialEq for Project {
    fn eq(&self, other: &Self) -> bool {
        self.capital_needed == other.capital_needed
    }
}

use std::cmp::Reverse;
use std::collections::BinaryHeap;

impl Solution {
    pub fn find_maximized_capital(
        max_project_count: i32,
        initial_capital: i32,
        profits: Vec<i32>,
        capitals_needed: Vec<i32>,
    ) -> i32 {
        let mut max_profits = BinaryHeap::new();
        let mut projects = BinaryHeap::new();
        for i in 0..profits.len() {
            let project = Project {
                profit: profits[i],
                capital_needed: capitals_needed[i],
            };
            projects.push(Reverse(project));
        }

        let mut current_capital = initial_capital;

        for _ in 0..max_project_count {
            while !projects.is_empty()
                && projects.peek().unwrap().0.capital_needed <= current_capital
            {
                let project = projects.pop().unwrap().0;
                max_profits.push(project.profit);
            }

            if let Some(max_profit) = max_profits.pop() {
                current_capital += max_profit;
            }
        }

        current_capital
    }
}