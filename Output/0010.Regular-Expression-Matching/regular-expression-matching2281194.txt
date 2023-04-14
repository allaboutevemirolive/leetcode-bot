// https://leetcode.com/problems/regular-expression-matching/solutions/2281194/c-rust-bottom-up-dp/
impl Solution {
	pub fn is_match(s: String, p: String) -> bool {   
		let m = s.len();
		let n = p.len();
		let s = s.as_bytes();
		let p = p.as_bytes();
		let mut dp = vec![vec![false;m+1];n+1];
		for i in 0..=n {
			for j in 0..=m {
				if i == 0 && j == 0 {dp[i][j]=true;}
				else if i==0 {dp[i][j]=false;}
				else if j==0 {
					let ch = p[i-1] as char;
					if ch == '*' {dp[i][j]=dp[i-2][j];}
					else {dp[i][j]=false;}
				}else {
					let pc = p[i-1] as char;
					let sc = s[j-1] as char;
					if pc == '*' {
						dp[i][j] = dp[i-2][j];
						let pp = p[i-2] as char;
						if pp == sc || pp == '.' {dp[i][j] |= dp[i][j-1];}
					} else if sc == pc || pc == '.' {dp[i][j] = dp[i-1][j-1];}
				}
			}
		}
		dp[n][m]
	}
}