// https://leetcode.com/problems/ipo/solutions/3220383/most-concise-and-self-explaining-implementation-in-rust-i-can-get/
impl Solution {
    pub fn find_maximized_capital(k: i32, mut w: i32, profits: Vec<i32>, capital: Vec<i32>) -> i32 {
        let n = capital.len();
        let mut projects = Vec::with_capacity(n);
        projects.extend(0..n);
        projects.sort_unstable_by_key(|&proj| capital[proj]);

        let mut opportunities = std::collections::BinaryHeap::with_capacity(n);
        let mut proj_id = 0;
        for _ in 0..k {
            while let Some(profit) = projects.get(proj_id).copied().filter(|&proj| capital[proj] <= w).map(|proj| profits[proj]) {
                opportunities.push(profit);
                proj_id += 1;
            }
            w += if let Some(profit) = opportunities.pop() { profit } else { break };
        }

        w
    }
}