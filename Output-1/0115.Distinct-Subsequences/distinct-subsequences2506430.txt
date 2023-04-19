// https://leetcode.com/problems/distinct-subsequences/solutions/2506430/rust-dp-bottom-up-linear-space-simple/
 /*
	115 - Distinct Subsequences
	Time: O(m*n)
	Space: O(n)
*/
pub fn num_distinct(s: String, t: String) -> i32 {
	let s = s.as_bytes();
	let t = t.as_bytes();
	let m = s.len();
	let n = t.len();
	let mut dp = [vec![0; n + 1], vec![0; n + 1]];
	dp[0][n] = 1;
	dp[1][n] = 1;
	for i in (0..m).rev() {
		for j in (0..n).rev() {
			dp[0][j] = if s[i] == t[j] {
				dp[1][j] + dp[1][j + 1]
			} else {
				dp[1][j]
			};
		}
		dp.swap(0, 1);
	}
	dp[1][0]
}