// https://leetcode.com/problems/edit-distance/solutions/2952498/rust-dp-solution/
impl Solution {
    pub fn min_distance(word1: String, word2: String) -> i32 {
        let word1: Vec<char> = word1.chars().collect();
        let word2: Vec<char> = word2.chars().collect();
        let m = word1.len();
        let n = word2.len();

        let mut f: Vec<Vec<i32>> = vec![vec![0; n + 1]; m + 1];

        for i in 0..m + 1 {
            for j in 0..n + 1 {
                if i == 0 {
                    f[i][j] = j as i32;
                } else if j == 0 {
                    f[i][j] = i as i32;
                } else {
                    if word1[i - 1] == word2[j - 1] {
                        f[i][j] = f[i - 1][j - 1];
                    } else {
                        f[i][j] = std::cmp::min(f[i - 1][j - 1], std::cmp::min(f[i - 1][j], f[i][j - 1])) + 1;
                    }
                }
            }
        }

        f[m][n]
    }
}