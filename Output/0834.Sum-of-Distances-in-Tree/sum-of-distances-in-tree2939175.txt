// https://leetcode.com/problems/sum-of-distances-in-tree/solutions/2939175/rust-dfs-solution-with-comments/
impl Solution {
    pub fn sum_of_distances_in_tree(n: i32, edges: Vec<Vec<i32>>) -> Vec<i32> {
        let n = n as usize;
        let mut graph = vec![vec![]; n];
        for e in edges {
            let (u, v) = (e[0] as usize, e[1] as usize);
            graph[u].push(v);
            graph[v].push(u);
        }

        let mut count = vec![0; n];
        Self::dfs1(&graph, &mut count, 0);
        let (mut flag, mut ret) = (vec![0; n], vec![-1; n]);

        ret[0] = Self::dfs2(&graph, &mut count, &mut flag, 0);
        Self::dfs3(&graph, &count, &mut ret, 0, n as i32);
        
        ret
    }

    fn dfs1(graph: &Vec<Vec<usize>>, count: &mut Vec<i32>, u: usize) -> i32 {
        count[u] = 1;
        for v in &graph[u] {
            if count[*v] > 0 { continue }
            count[u] += Self::dfs1(graph, count, *v);
        }
        count[u]
    }

    fn dfs2(graph: &Vec<Vec<usize>>, count: &mut Vec<i32>, flag: &mut Vec<i32>, u: usize) -> i32 {
        let mut ret = count[u] - 1;
        flag[u] = 1;
        for v in &graph[u] {
            if flag[*v] == 1 { continue }
            ret += Self::dfs2(graph, count, flag, *v);
        }
        ret
    }

    fn dfs3(graph: &Vec<Vec<usize>>, count: &Vec<i32>, ret: &mut Vec<i32>, u: usize, n: i32) {
        for v in &graph[u] {
            if ret[*v] != -1 { continue }
            ret[*v] = ret[u] + (n - count[*v]) - count[*v];

            Self::dfs3(graph, count, ret, *v, n);
        }
    }
}