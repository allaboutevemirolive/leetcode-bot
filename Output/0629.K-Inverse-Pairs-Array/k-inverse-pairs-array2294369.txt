// https://leetcode.com/problems/k-inverse-pairs-array/solutions/2294369/rust-recursive-dp-approach/
const MODE: i32 = 1_000_000_007;
impl Solution {
	pub fn k_inverse_pairs(n: i32, k: i32) -> i32 {
		// for i in 0..10 {
		//     for j in 0..10 {
		//         print!("{:?} ",Self::f(i,j));
		//     }
		//     println!("");
		// }
		let mut dp: Vec<Vec<i32>> = vec![vec![-1;k as usize+1];n as usize+1];
		Self::f(n, k, &mut dp)
	}
	fn f(n: i32, k: i32, dp: &mut Vec<Vec<i32>>) -> i32 {
		if k==0 {return 1;}
		if n<=0 {return 0;}
		let mut cnt: i32 = 0;
		if dp[n as usize][k as usize] != -1 {return dp[n as usize][k as usize];}
		// for i in 0..=k.min(n-1){
		//     cnt = (cnt + Self::f(n-1,k-i))%MODE;
		// }
		cnt += (Self::f(n-1,k,dp) + MODE - if k-n>=0 {Self::f(n-1,k-n,dp)} else {0})%MODE;
		cnt = (Self::f(n,k-1,dp) + cnt)%MODE;
		dp[n as usize][k as usize] = cnt;
		cnt
	}
}