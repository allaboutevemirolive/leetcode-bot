// https://leetcode.com/problems/reachable-nodes-in-subdivided-graph/solutions/1459584/rust-solution/
use std::cmp::Reverse;
use std::collections::BinaryHeap;

impl Solution {
    pub fn reachable_nodes(edges: Vec<Vec<i32>>, max_moves: i32, n: i32) -> i32 {
        let mut graph = vec![Vec::new(); n as usize];
        for edge in &edges {
            graph[edge[0] as usize].push((edge[1] as usize, edge[2]));
            graph[edge[1] as usize].push((edge[0] as usize, edge[2]));
        }
        let mut remains = vec![None; n as usize];
        let mut bh = BinaryHeap::new();
        bh.push((Reverse(0), 0));
        let mut answer = 0;
        while let Some((Reverse(min), u)) = bh.pop() {
            if min > max_moves {
                break;
            }
            if remains[u].is_some() {
                continue;
            }
            answer += 1;
            remains[u] = Some(max_moves - min);
            for &(v, c) in graph[u].iter().filter(|(v, _)| remains[*v].is_none()) {
                bh.push((Reverse(min + c + 1), v));
            }
        }
        for edge in &edges {
            answer += edge[2].min(
                remains[edge[0] as usize].unwrap_or(0) + remains[edge[1] as usize].unwrap_or(0),
            );
        }
        answer
    }
}