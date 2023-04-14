// https://leetcode.com/problems/sum-of-distances-in-tree/solutions/2937393/rust-dfs-2-times/
impl Solution {
    pub fn sum_of_distances_in_tree(n: i32, edges: Vec<Vec<i32>>) -> Vec<i32> {
        let n = n as usize;
        let mut adj: Vec<Vec<usize>> = vec![Vec::new(); n];
        for v in edges.iter() {
            adj[v[0] as usize].push(v[1] as usize);
            adj[v[1] as usize].push(v[0] as usize);
        }
        let mut dp = vec![[0; 2]; n];
        Self::get_depth_sum_and_count(0, n, &mut dp, &adj);
        let mut ans = vec![0; n];
        Self::get_ans(0, n, 0, &mut ans, &dp, &adj);
        ans
    }

    fn get_depth_sum_and_count(i: usize, parent: usize, dp: &mut Vec<[i32; 2]>, adj: &Vec<Vec<usize>>) {
        dp[i][1] = 1;
        for &j in adj[i].iter() {
            if j == parent {
                continue;
            }
            Self::get_depth_sum_and_count(j, i, dp, adj);
            dp[i][0] += dp[j][0] + dp[j][1];
            dp[i][1] += dp[j][1];
        }
    }

    fn get_ans(i: usize, parent: usize, acc_sum: i32, ans: &mut Vec<i32>, dp: &Vec<[i32; 2]>, adj: &Vec<Vec<usize>>) {
        ans[i] = acc_sum + dp[i][0];
        for &j in adj[i].iter() {
            if j == parent {
                continue;
            }
            // excluding the "j subtree part" of the sum of dist
            // excl = ans[i] - dp[j][0] - dp[j][1]
            // add 1 for each node outside the j subtree
            // sum2 = excl + dp.len() as i32 - dp[j][1]
            let sum2 = acc_sum + dp[i][0] + dp.len() as i32 - dp[j][0] - dp[j][1] * 2;
            Self::get_ans(j, i, sum2, ans, dp, adj);
        }
    }
}