// https://leetcode.com/problems/shortest-path-visiting-all-nodes/solutions/1799848/rust-translated-bfs-solution/
use std::collections::VecDeque;

impl Solution {
    pub fn shortest_path_length(graph: Vec<Vec<i32>>) -> i32 {
        let mut seen = vec![vec![false; graph.len()]; 1 << graph.len()];
        let mut vd = VecDeque::new();
        for i in 0..graph.len() {
            vd.push_back((i, 1 << i));
            seen[1 << i][i] = true;
        }
        let end = (1 << graph.len()) - 1;
        for len in 0.. {
            for _ in 0..vd.len() {
                if let Some((i, mask)) = vd.pop_front() {
                    if mask == end {
                        return len;
                    }
                    for &j in &graph[i] {
                        if !seen[mask | (1 << j)][j as usize] {
                            seen[mask | (1 << j)][j as usize] = true;
                            vd.push_back((j as usize, mask | (1 << j)));
                        }
                    }
                }
            }
        }
        unreachable!()
    }
}