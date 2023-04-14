// https://leetcode.com/problems/longest-increasing-path-in-a-matrix/solutions/2265218/rust-dp-solution-runtime-o-m-n-memory-o-m-n/
impl Solution {
    pub fn longest_increasing_path(matrix: Vec<Vec<i32>>) -> i32 {
        let dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
        let (m, n) = (matrix.len(), matrix[0].len());
        let mut v: Vec<(i32, usize, usize)> = Vec::new();
        
        for i in 0..m {
            for j in 0..n {
                v.push((matrix[i][j], i, j));
            }
        }
        v.sort();
        
        let mut ret = 1;
        let mut dp = vec![vec![1i32; n]; m];
        for (a, i, j) in v {
            for d in dirs {
                let x = i as i32 + d[0];
                let y = j as i32 + d[1];
                if x < 0 || x == m as i32 || y < 0 || y == n as i32 { continue; }
                if matrix[x as usize][y as usize] >= matrix[i][j] { continue; }
                dp[i][j] = dp[i][j].max(dp[x as usize][y as usize] + 1);
            } 
            
            ret = ret.max(dp[i][j]);
        }
        
        ret
    }
}