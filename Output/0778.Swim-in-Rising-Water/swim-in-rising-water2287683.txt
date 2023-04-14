// https://leetcode.com/problems/swim-in-rising-water/solutions/2287683/rust-dijkstra-using-binaryheap/
use std::cmp::Reverse;
use std::collections::BinaryHeap;

impl Solution {
    pub fn swim_in_water(grid: Vec<Vec<i32>>) -> i32 {
        let dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let mut ret = 0;
        let n = grid.len();
        let mut pq = BinaryHeap::new();
        let mut flag = vec![vec![false; n]; n];
        
        pq.push(Reverse((grid[0][0], 0, 0)));
        flag[0][0] = true;
        
        while pq.is_empty() == false {
            match pq.pop() {
                Some (node) => {
                    let (h, i, j) = ((node.0).0, (node.0).1, (node.0).2);
                    ret = ret.max(h);
                    if i == n - 1 && j == n - 1 { break; }
                    for d in dirs {
                        let (u, v) = (i as i32 + d[0], j as i32 + d[1]);
                        if u < 0 || u == n as i32 || v < 0 || v == n as i32 { continue; }
                        let (u, v) = (u as usize, v as usize);
                        if flag[u][v] == true { continue; }
                        flag[u][v] = true;
                        pq.push(Reverse((grid[u][v], u, v)));
                    }
                }
                None => { panic!(); }
            }
        }
        ret
    }
}