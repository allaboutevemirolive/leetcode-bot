// https://leetcode.com/problems/frog-jump/solutions/2815143/rust-dfs-64ms/
use std::collections::{HashMap, HashSet};

impl Solution {
    pub fn can_cross(stones: Vec<i32>) -> bool {
        fn dfs(cur: usize, k: usize, stones: &Vec<usize>, seen: &mut HashSet<(usize,usize)>, m: &HashMap<usize,usize>) -> bool {
            //println!("{cur} {k} {}", stones[cur]);
            if cur == stones.len() -1 {
                true
            } else {
                let nxts = [(k -1, stones[cur] + k -1), (k, stones[cur] + k), (k +1, stones[cur] + k +1)];
                for (nxt_k,nxt) in nxts {
                    match m.get(&nxt) {
                        Some(&i) if seen.insert((i, nxt_k)) && dfs(i, nxt_k, stones, seen, m) => {
                            return true
                        },
                        _ => (),
                    }
                }
                false
            }
        }
        let stones = stones.iter().map(|x| {*x as usize}).collect::<Vec<usize>>();
        let m = stones.iter().enumerate().map(|(i,s)| (*s,i)).collect::<HashMap<usize,usize>>();
        stones[1] == 1 && dfs(1,1,&stones, &mut HashSet::new(), &m)
    }
}