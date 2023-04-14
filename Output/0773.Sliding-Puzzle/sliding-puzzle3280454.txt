// https://leetcode.com/problems/sliding-puzzle/solutions/3280454/rust-concise-bfs-beats-100/
use std::collections::{HashSet, VecDeque};

impl Solution {
    pub fn sliding_puzzle(board: Vec<Vec<i32>>) -> i32 {
        let target = vec![1, 2, 3, 4, 5, 0];
        let start = board.into_iter().flatten().collect::<Vec<i32>>();
        let dirs = vec![vec![1, 3], vec![0, 2, 4], vec![1, 5], vec![0, 4], vec![1, 3, 5], vec![2, 4]];
        let mut queue = VecDeque::from([(start.clone(), 0)]);
        let mut visited = HashSet::from([start]);

        while let Some((curr, step)) = queue.pop_front() {
            if curr == target {
                return step;
            }
            let zero = curr.iter().position(|&x| x == 0).unwrap();
            for &i in &dirs[zero] {
                let mut next = curr.clone();
                next.swap(i, zero);
                if visited.contains(&next) { continue; }
                queue.push_back((next.clone(), step + 1));
                visited.insert(next);
            }
        }
        -1
    }
}