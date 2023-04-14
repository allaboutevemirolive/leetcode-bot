// https://leetcode.com/problems/longest-increasing-path-in-a-matrix/solutions/2053932/rust-dfs-with-memoization/
pub fn longest_increasing_path(matrix: Vec<Vec<i32>>) -> i32 {
    if matrix.is_empty() {
        return 0;
    }

    let mut cache = vec![vec![0; matrix[0].len()]; matrix.len()];
    let mut answer = 0;

    for r in 0..matrix.len() {
        for c in 0..matrix[r].len() {
            answer = answer.max(dfs(&matrix, &mut cache, r, c, matrix[r][c]));
        }
    }

    answer
}

fn dfs(matrix: &[Vec<i32>], cache: &mut [Vec<i32>], r: usize, c: usize, value: i32) -> i32 {
    if cache[r][c] != 0 {
        return cache[r][c];
    }

    let mut len = 0;

    if r > 0 && matrix[r - 1][c] > value {
        len = len.max(dfs(matrix, cache, r - 1, c, matrix[r - 1][c]));
    }

    if c > 0 && matrix[r][c - 1] > value {
        len = len.max(dfs(matrix, cache, r, c - 1, matrix[r][c - 1]));
    }

    if c < matrix[r].len() - 1 && matrix[r][c + 1] > value {
        len = len.max(dfs(matrix, cache, r, c + 1, matrix[r][c + 1]));
    }

    if r < matrix.len() - 1 && matrix[r + 1][c] > value {
        len = len.max(dfs(matrix, cache, r + 1, c, matrix[r + 1][c]));
    }

    cache[r][c] = len + 1;

    len + 1
}