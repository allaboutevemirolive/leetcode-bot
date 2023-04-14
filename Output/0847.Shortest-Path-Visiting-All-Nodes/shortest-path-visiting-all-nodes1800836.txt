// https://leetcode.com/problems/shortest-path-visiting-all-nodes/solutions/1800836/rust-solution/
impl Solution {
    pub fn shortest_path_length(graph: Vec<Vec<i32>>) -> i32 {
        let n = graph.len();
        let mut d = vec![vec![n + 1; n]; n];
        for (v, us) in graph.into_iter().enumerate() {
            d[v][v] = 0;
            for u in us {
                d[v][u as usize] = 1;
            }
        }
        for k in 0..n {
            for i in 0..n {
                for j in 0..n {
                    if d[i][k] + d[k][j] < d[i][j] {
                        d[i][j] = d[i][k] + d[k][j];
                    }
                }
            }
        }

        let last = (1 << n) - 1;
        let mut dp = vec![vec![0; n]; last + 1];
        for mask in (0..last).rev() {
            for (v, row) in d.iter().enumerate() {
                dp[mask][v] = (0..n)
                    .filter(|&u| ((mask >> u) & 1) == 0)
                    .map(|u| row[u] + dp[mask | (1 << u)][u])
                    .min()
                    .unwrap();
            }
        }
        dp.swap_remove(0).into_iter().min().unwrap() as _
    }
}