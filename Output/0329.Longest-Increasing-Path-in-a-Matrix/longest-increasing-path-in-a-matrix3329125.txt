// https://leetcode.com/problems/longest-increasing-path-in-a-matrix/solutions/3329125/rust-dfs-dp/
impl Solution {
    pub fn longest_increasing_path(matrix: Vec<Vec<i32>>) -> i32 {
        let mut mx = 0;
        let mut dp = vec![vec![0; matrix[0].len()];matrix.len()];
        for i in 0..matrix.len() {
            for j in 0..matrix[0].len() {
                Self::find_path((i,j), -1, &matrix, 1, &mut dp);
            }
        }
        *dp.iter().map(|v|v.iter().max().unwrap()).max().unwrap() + 1
    }

    pub fn find_path((i,j): (usize, usize), value: i32, matrix: &Vec<Vec<i32>>, path_len: i32, dp:&mut Vec<Vec<i32>>) -> i32 {
        if  i == matrix.len()  || j == matrix[0].len() || matrix[i][j] <= value {
            return path_len - 1
        }
        if dp[i][j] != 0 {
            return path_len + dp[i][j]
        }
        let maximum = Self::find_path((i.saturating_sub(1),j), matrix[i][j], matrix, path_len + 1, dp)
            .max(
            Self::find_path((i+1,j), matrix[i][j], matrix, path_len + 1, dp)
        ).max(
            Self::find_path((i,j.saturating_sub(1)), matrix[i][j], matrix, path_len + 1, dp)
        ).max(
            Self::find_path((i,j+1), matrix[i][j], matrix, path_len + 1, dp)
        );
        dp[i][j] = maximum - path_len;
        maximum
    }
}