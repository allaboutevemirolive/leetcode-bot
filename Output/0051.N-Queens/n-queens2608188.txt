// https://leetcode.com/problems/n-queens/solutions/2608188/rust-concise-bfs/
impl Solution {
    pub fn solve_n_queens(n: i32) -> Vec<Vec<String>> {
		// create all possible first rows
        let mut level = Vec::new();
        for i in (0..n) {
            level.push(vec![i]);
        }
        // for each additional row append and each board append a queen in each possible position
		// note we need only check the new queen does not offend the existing queens
        for _ in (1..n) {
            let mut new_level = Vec::new();
            for v in &level {
                for j in (0..n) {
                    if !v.contains(&j) && v.iter().rev().enumerate().all(|(i,x)| (x-j).abs() != (1 + i as i32)) {
                        new_level.push(v.iter().copied().chain(vec![j]).collect());
                    }
                }
            }
            level = new_level.to_vec();
        }
        // translate formats
        level.iter().map(|board| board.iter().map(|row| {
            format!("{}Q{}", ".".repeat(*row as usize), ".".repeat((n - *row -1) as usize))
            }).collect()).collect()
    }
}