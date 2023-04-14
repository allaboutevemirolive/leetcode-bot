// https://leetcode.com/problems/shortest-path-visiting-all-nodes/solutions/1516711/rust-bfs-bitmask-dp-solution-16-ms-2-5-mb/
use std::collections::VecDeque;

fn advance_mask(n: usize, mut mask: usize) -> Option<usize> {
    let mut num_bits = (mask >> (n-1)) & 1;
    for b in (0..n-1).rev() {
        if (mask >> b) & 1 == 1 {
            num_bits += 1;
            if (mask >> (b+1)) & 1 == 0 {
                return Some((mask & ((1 << b)-1)) | (((1 << num_bits)-1) << (b+1)));
            }
        }
    }
    None
}

impl Solution {
    pub fn shortest_path_length(graph: Vec<Vec<i32>>) -> i32 {
        let n = graph.len();
        
        let mut dists = vec![vec![None; n]; n];
        for i in (0..n) {
            let mut que = VecDeque::new();
            que.push_back(i);
            dists[i][i] = Some(0);
            while let Some(v) = que.pop_front() {
                let cur_dist = dists[i][v].unwrap();
                for &v2 in graph[v].iter() {
                    let v2 = v2 as usize;
                    if let None = dists[i][v2] {
                        dists[i][v2] = Some(cur_dist+1);
                        que.push_back(v2);
                    }
                }
            }
        }
        
        let mut costs = vec![vec![None; n]; 1 << n];
        
        for v in (0..n) {
            costs[0][v] = Some(0);
            costs[1 << v][v] = Some(0);
        }
        
        for sz in (2..=n) {
            let mut cur_mask = (1 << sz)-1;
            loop {
                for b in (0..n) {
                    if (cur_mask >> b) & 1 == 1 {
                        let mut best_cost = None;
                        for b2 in (0..n) {
                            if b != b2 && (cur_mask >> b2) & 1 == 1 {
                                if let Some(dist) = dists[b][b2] {
                                    if let Some(prev_cost) = costs[cur_mask ^ (1 << b)][b2] {
                                        let new_cost = prev_cost+dist;
                                        match best_cost {
                                            None => best_cost = Some(new_cost),
                                            Some(ref old_cost) => {
                                                if *old_cost > new_cost {
                                                    best_cost = Some(new_cost);
                                                }
                                            }
                                        };
                                    }
                                }
                            }
                        }
                        costs[cur_mask][b] = best_cost;
                    }
                }
                
                match advance_mask(n, cur_mask) {
                    None => break,
                    Some(new_mask) => cur_mask = new_mask
                };
            }
        }
        
        costs[(1 << n)-1].iter().filter_map(|n| n.clone()).min().unwrap()
    }
}