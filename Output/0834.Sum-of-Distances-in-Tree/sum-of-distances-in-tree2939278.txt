// https://leetcode.com/problems/sum-of-distances-in-tree/solutions/2939278/rust-solution-using-dp-and-dfs/
use std::collections::HashMap;

impl Solution {
    pub fn sum_of_distances_in_tree(n: i32, edges: Vec<Vec<i32>>) -> Vec<i32> {
        let mut edge = vec![vec![]; n as usize];
        for v in edges.iter() {
            let a = v[0] as usize;
            let b = v[1] as usize;
            edge[a].push(b);
            edge[b].push(a);
        }
        let mut cache: HashMap<(usize, usize), (i32, i32)> = HashMap::new();
        fn dfs(
            current: usize,
            edge: &Vec<Vec<usize>>,
            cache: &mut HashMap<(usize, usize), (i32, i32)>,
            prev: usize,
        ) -> (i32, i32) {
            let mut sum = 0;
            let mut node_count = 1;
            for &next in edge[current].iter() {
                if next != prev {
                    if !cache.contains_key(&(current, next)) {
                        let (dist, count) = dfs(next, edge, cache, current);
                        cache.insert((current, next), (dist + count, count));
                    }
                    cache.get(&(current, next)).map(|(d, c)| {
                        sum += d;
                        node_count += c;
                    });
                }
            }
            (sum, node_count)
        }
        (0..n as usize)
            .map(|i| dfs(i, &edge, &mut cache, i).0)
            .collect()
    }
}