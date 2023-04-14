// https://leetcode.com/problems/max-sum-of-rectangle-no-larger-than-k/solutions/2488688/c-rust-2d-prefix-sum-100-faster/
impl Solution {
	pub fn max_sum_submatrix(matrix: Vec<Vec<i32>>, k: i32) -> i32 {
		let m: usize = matrix.len();        
		let n: usize = matrix[0].len();
		let mut pre_sum = vec![vec![0;n+1];m+1];
		for i in 1..=m {
			for j in 1..=n {
				pre_sum[i][j]=-pre_sum[i-1][j-1]+pre_sum[i-1][j]+pre_sum[i][j-1]+matrix[i-1][j-1];
			}
		}

		// println!("{:?}", pre_sum);

		let mut ans: i32 = -12222;
		for sr in 1..=m {
			for sc in 1..=n {
				for er in sr..=m {
					for ec in sc..=n {
						let area = pre_sum[er][ec]-pre_sum[er][sc-1]-pre_sum[sr-1][ec]+pre_sum[sr-1][sc-1];
						if area <= k {ans = ans.max(area);}
					}
				}
			}
		}
		ans
	}
}