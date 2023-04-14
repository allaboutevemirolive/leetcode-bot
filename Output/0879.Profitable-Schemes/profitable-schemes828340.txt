// https://leetcode.com/problems/profitable-schemes/solutions/828340/rust-translated-8ms-100/
impl Solution {
    pub fn profitable_schemes(g: i32, p: i32, group: Vec<i32>, profit: Vec<i32>) -> i32 {
        const MOD: i32 = 1_000_000_007;
        let mut dp = vec![vec![0; g as usize + 1]; p as usize + 1];
        dp[0][0] = 1;
        let mut res = 0;
        for k in 0..group.len() {
            let g1 = group[k];
            let p1 = profit[k];
            for i in (0..p + 1).rev() {
                for j in (0..=g - g1).rev() {
                    dp[std::cmp::min(i + p1, p) as usize][(j + g1) as usize] = (dp
                        [std::cmp::min(i + p1, p) as usize][(j + g1) as usize]
                        + dp[i as usize][j as usize])
                        % MOD;
                }
            }
        }
        for &x in &dp[p as usize] {
            res = (res + x) % MOD;
        }
        res
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_profitable_schemes() {
        assert_eq!(
            Solution::profitable_schemes(5, 3, vec![2, 2,], vec![2, 3]),
            2
        )
    }

    #[test]
    fn test_profitable_schemes_02() {
        assert_eq!(
            Solution::profitable_schemes(10, 5, vec![2, 3, 5], vec![6, 7, 8]),
            7
        )
    }
}