// https://leetcode.com/problems/longest-increasing-path-in-a-matrix/solutions/1151497/rust-top-down-dp/
impl Solution {
    pub fn longest_increasing_path(matrix: Vec<Vec<i32>>) -> i32 {
        let m = matrix.len() - 1;
        let n = matrix[0].len() - 1;
        
        let mut max = 0;
        let mut cache = vec![vec![None; n + 1]; m + 1];
        for i in 0..=m {
            for j in 0..=n {
                let len = Self::dfs(&matrix, (m, n), (i, j), &mut cache);
                max = max.max(len);
            }
        }
        max
    }
    
    fn dfs(
        matrix: &[Vec<i32>], 
        bounds: (usize, usize), 
        cur: (usize, usize), 
        cache: &mut Vec<Vec<Option<i32>>>
    ) -> i32 {
        let (m, n) = bounds;
        let (i, j) = cur;
        
        if let Some(cached) = cache[i][j] {
            return cached;
        }
        
        let v = matrix[i][j];
        
        let mut res = 0;
        if i > 0 && matrix[i - 1][j] > v {
            res = res.max(Self::dfs(matrix, bounds, (i - 1, j), cache));
        }
        if i < m && matrix[i + 1][j] > v {
            res = res.max(Self::dfs(matrix, bounds, (i + 1, j), cache));
        }
        if j > 0 && matrix[i][j - 1] > v {
            res = res.max(Self::dfs(matrix, bounds, (i, j - 1), cache));
        }
        if j < n && matrix[i][j + 1] > v {
            res = res.max(Self::dfs(matrix, bounds, (i, j + 1), cache));
        }
        res += 1;
        cache[i][j] = Some(res);
        res
    }
}