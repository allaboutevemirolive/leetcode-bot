// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2490982/fast-rust-solution/
impl Solution {
    pub fn max_sum_submatrix(matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        let (n, m) = (matrix.len(), matrix[0].len());
        let mut mx = (-1e9-7.0) as i32;
        for i in 0..n {
            for j in (i+1)..(n+1) {
                let mut vk = Vec::new();
                for y in 0..m {
                    let mut su = 0;
                    for x in i..j {
                        su += matrix[x][y];
                    }
                    vk.push(0);
                    for I in (0..vk.len()).rev() {
                        let nVal = vk[I] + su;
                        if nVal <= k {
                            mx = mx.max(nVal);
                        }
                        vk[I] = nVal;
                    }
                }
            }
        }
        return mx;
    }
}