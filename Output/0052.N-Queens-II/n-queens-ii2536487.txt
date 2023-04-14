// https://leetcode.com/problems/n-queens-ii/solutions/2536487/go-rust-java-python-dfs-with-bitmask/
impl Solution {
    pub fn total_n_queens(n: i32) -> i32 {
        Solution::dfs((1 << n) - 1, 0, 0, 0)
    }
    fn dfs(bitmask: i32, diagonal_135: i32, diagonal_45: i32, col_mask: i32) -> i32 {
        if bitmask == col_mask {
            return 1;
        }
        let mut available = bitmask & (!(diagonal_135 | diagonal_45 | col_mask));
        let mut res = 0;
        while available > 0 {
            let bit_info = available & (-available);
            available -= bit_info;
            res += Solution::dfs(
                bitmask,
                (diagonal_135 | bit_info) >> 1,
                (diagonal_45 | bit_info) << 1,
                col_mask | bit_info,
            )
        }
        res
    }
}