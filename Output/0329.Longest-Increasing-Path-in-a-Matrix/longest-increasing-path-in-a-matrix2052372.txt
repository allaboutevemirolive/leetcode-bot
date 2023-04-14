// https://leetcode.com/problems/longest-increasing-path-in-a-matrix/solutions/2052372/rust-yet-another-dp-solution/
impl Solution {
    pub fn longest_increasing_path(matrix: Vec<Vec<i32>>) -> i32 {
        let mut dp = vec![vec![0; matrix[0].len()]; matrix.len()];
        let mut ans = 0;
        for i in 0..dp.len() {
            for j in 0..dp[0].len() {
                ans = ans.max(Self::max_path(i, j, &mut dp, &matrix));
            }
        }
        ans
    }

    const DIR: [[i32; 2]; 4] = [[1,0],[0,1],[-1,0],[0,-1]];
    
    fn max_path(x: usize, y: usize, dp: &mut Vec<Vec<i32>>, matrix: &Vec<Vec<i32>>) -> i32 {
        if dp[x][y] > 0 {
            return dp[x][y];
        }
        let mut path = 1;
        for d in Self::DIR.iter() {
            let i = x as i32 + d[0];
            let j = y as i32 + d[1];
            if i >= 0 && i < dp.len() as i32
            && j >= 0 && j < dp[0].len() as i32 {
                if matrix[i as usize][j as usize] > matrix[x][y] {
                    path = path.max(Self::max_path(i as usize, j as usize, dp, matrix) + 1);
                }
            }
        }
        dp[x][y] = path;
        path
    }
}