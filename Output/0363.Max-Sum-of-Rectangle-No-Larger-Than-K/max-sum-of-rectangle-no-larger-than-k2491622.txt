// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2491622/rust-100-runtime-100-memory-idiomatic-solution/
impl Solution {
    pub fn max_sum_submatrix(mut matrix: Vec<Vec<i32>>, k: i32) -> i32 {
        fn get(m: &[Vec<i32>], i: usize, j: usize) -> Option<i32> {
            m.get(i)?.get(j).copied()
        }

        let mut best = i32::MIN;

        for i in (0..matrix.len()).rev() {
            for j in (0..matrix[0].len()).rev() {
                let b = get(&matrix, i + 1, j).unwrap_or(0);
                let r = get(&matrix, i, j + 1).unwrap_or(0);
                let br = get(&matrix, i + 1, j + 1).unwrap_or(0);
                matrix[i][j] += b + r - br;
            }
        }

        matrix.iter_mut().for_each(|v| v.push(0));
        matrix.push(vec![0; matrix[0].len()]);

        for i in 0..matrix.len() {
            for j in 0..matrix[0].len() {
                for i_ in i + 1..matrix.len() {
                    for j_ in j + 1..matrix[0].len() {
                        let la = matrix[i][j];
                        let lb = matrix[i_][j];
                        let ra = matrix[i][j_];
                        let rb = matrix[i_][j_];
                        let v = la - lb - ra + rb;
                        if v <= k {
                            best = best.max(v);
                        }
                    }
                }
            }
        }

        best
    }
}